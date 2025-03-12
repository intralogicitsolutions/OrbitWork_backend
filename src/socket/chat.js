const SocketSchema = require('../models/socket');
const MessageSchema = require('../models/message');
const GroupMessageSchema = require('../models/group_message');
const RoomSchema = require('../models/room');  
const { logger } = require("../utils");
const { messageConstants } = require('../constants');
const { uploadFile } = require('../services/upload_file');

module.exports = (io) => {    
    logger.info(`Socket ${messageConstants.CONNECTED_SUCCESSFULLY}`);
    io.on('connection', async (socket) => {
        logger.info(`User ${socket.id} ${messageConstants.CONNECTED_SUCCESSFULLY}`);

        socket.on('connect_user', async (data) => {
            logger.info(`Data received in request body during connect_user ${JSON.stringify(data)}`)
            const socketData = await SocketSchema.find({ user_id: data.user_id });
            if (socketData.length !== 0) {
                await updateSocket(socket, socketData);
            } else {
                await createSocket(data, socket);
            }
            await socket.emit('connect_user', socket.id);
        })

        // Join a group chat

        socket.on('join_room', async (data) => {
            logger.info(`User joining room: ${JSON.stringify(data)}`);
            const { user_id, room_id } = data;

            // Check if room exists
            const room = await RoomSchema.findById(room_id);
            if (!room) {
                logger.error(`Room ID ${room_id} not found`);
                socket.emit('error', { message: 'Room not found' });
                return;
            }

            socket.join(room_id); // Join socket.io room
            logger.info(`User ${user_id} joined room ${room_id}`);

            socket.emit('joined_room', { message: `Joined room ${room_id}` });
        });

         // Leave a group chat
         socket.on('leave_room', async (data) => {
            logger.info(`User leaving room: ${JSON.stringify(data)}`);
            const { user_id, room_id } = data;

            socket.leave(room_id);
            logger.info(`User ${user_id} left room ${room_id}`);

            socket.emit('left_room', { message: `Left room ${room_id}` });
        });

        // Chat message (handles both individual & group chat)

        socket.on('chat_message', async (data) => {
            logger.info(`Data received in request body during chat_message ${JSON.stringify(data)}`)

            if (data.file) {
                try {
                    attachmentId = await uploadFile(data.file)._id; // Call upload API
                    logger.info(`File uploaded successfully with ID: ${attachmentId}`);
                } catch (error) {
                    logger.error(`File upload failed: ${error.message}`);
                    return;
                }
            }


            const saveMessage = await createMessage(data);
            if (!saveMessage) {
                logger.error(messageConstants.MESSAGE_NOT_SENT);
                return;
            }

            // If it's a group chat, broadcast to the room
            if (data.room_id) {
                io.to(data.room_id).emit('chat_message', data);
            } else {
                // Individual chat
                const receiverSocketData = await SocketSchema.findOne({ user_id: data.receiver_id });
                if (receiverSocketData) {
                    io.to(receiverSocketData.socket_id).emit('chat_message', data);
                } else {
                    logger.error(messageConstants.RECEIVER_NOT_FOUND);
                }
            }
            // const receiverSocketData = await SocketSchema.find({ user_id: data.receiver_id });

            // const saveMessage = await createMessage(data);
            // if (saveMessage) {
            //     io.to(socket.id).emit('chat_message', data);
            //     if (receiverSocketData) {
            //         io.to(receiverSocketData[0]['socket_id']).emit('chat_message', data);
            //     } else {
            //         logger.error(messageConstants.RECEIVER_NOT_FOUND);
            //     }
            //     return saveMessage['_id'];
            // } else {
            //     logger.error(messageConstants.MESSAGE_NOT_SENT);
            // }
        })
        socket.on('disconnect', () => {
            logger.info(`User ${socket.id} disconnected`);
        })

    })
};


const updateSocket = async (socket, socketData) => {
    await SocketSchema.updateOne({
        user_id: socketData[0]['user_id']
    }, { $set: { socket_id: socket.id } }).then(() => {
        logger.info(`Socket updated succesfully for user id ${socketData[0]['user_id']} with socket id ${socket.id}`);
        return true;
    }).catch((err) => {
        logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
        return reject(err);
        // return false;
    })
}

const createSocket = async (data, socket) => {
    data['socket_id'] = socket.id;
    const socketSchema = new SocketSchema(data);
    await socketSchema.save().then(async () => {
        logger.info(`Socket created succesfully for user id ${data['user_id']} with socket id ${socket.id}`);
        return true;
    }).catch((err) => {
        if (err.code === 11000) {
            logger.error(`${Object.keys(err.keyValue)} already exists`);
            return false;
        } else {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return reject(err);
            // return false;
        }
    })
}

const createMessage = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const messageSchema = new MessageSchema(data);
            await messageSchema.save().then(result => {
                logger.info(messageConstants.MESSAGE_SAVED_SUCCESS, result);
                return resolve(result);
            })
        } catch (err) {
            logger.error(messageConstants.MESSAGE_CREATION_FAILED, err);
            return reject(err);
        }
    })
}