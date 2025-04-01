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

        // Create a message (direct or group)
        socket.on('chat_message', async (data) => {
            logger.info(`Data received in request body during chat_message ${JSON.stringify(data)}`);
        
           let saveMessage;
            if (data.room_id) {
               
                const room = await RoomSchema.findById(data.room_id);
                if (!room) {
                    logger.error(`Room ID ${data.room_id} not found`);
                    return;
                }

                const allReceivers = room.members.filter(id => id.toString() !== data.sender_id);

                 data.receiver_id = allReceivers;
                saveMessage = await createGroupMessage({ ...data, receiver_id: allReceivers  });
        
                if (!saveMessage) {
                    logger.error(messageConstants.MESSAGE_NOT_SENT);
                    return;
                }
                io.to(data.room_id).emit('chat_message', saveMessage);
            } else {
                saveMessage = await createMessage({ ...data, });
        
                if (!saveMessage) {
                    logger.error(messageConstants.MESSAGE_NOT_SENT);
                    return;
                }
        
                const receiverSocketData = await SocketSchema.findOne({ user_id: data.receiver_id });
                if (receiverSocketData) {
                    io.to(receiverSocketData.socket_id).emit('chat_message', saveMessage);
                } else {
                    logger.error(messageConstants.RECEIVER_NOT_FOUND);
                }
            }
        });

        socket.on('update_message', async (data) => {
            try {
                const updatedMessage = await updateMessage(data.messageId, data);
                if (!updatedMessage) {
                    socket.emit('error', { message: 'Message update failed' });
                    return;
                }
                logger.info(`Message updated successfully: ${JSON.stringify(updatedMessage)}`);

                const receiverSocketData = await SocketSchema.findOne({ user_id: updatedMessage.receiver_id });
                if (receiverSocketData) {
                    io.to(receiverSocketData.socket_id).emit('message_updated', updatedMessage);
                } else {
                    logger.error(`Receiver not found for message ${data.messageId}`);
                }
            } catch (err) {
                socket.emit('error', { message: 'Failed to update message' });
            }
        });
        
        socket.on('update_group_message', async (data) => {
            try {
                const updatedMessage = await updateGroupMessage(data.messageId, data);
                io.to(data.room_id).emit('group_message_updated', updatedMessage);
            } catch (err) {
                socket.emit('error', { message: 'Failed to update group message' });
            }
        });
        
        socket.on('delete_message', async (data) => {
            try {
                const deletedMessage = await deleteMessage(data.messageId);

               const receiverSocketData = await SocketSchema.findOne({ user_id: deletedMessage.receiver_id });
                if (receiverSocketData) {
                io.to(receiverSocketData.socket_id).emit('message_deleted', deletedMessage);
            } else {
                logger.error(`Receiver not found for message ${data.messageId}`);
            }
            } catch (err) {
                socket.emit('error', { message: 'Failed to delete message' });
            }
        });
        
        socket.on('delete_group_message', async (data) => {
            try {
                await deleteGroupMessage(data.messageId);
                io.to(data.room_id).emit('group_message_deleted', { messageId: data.messageId });
            } catch (err) {
                socket.emit('error', { message: 'Failed to delete group message' });
            }
        });
    })
};

const updateSocket = (socket, socketData) => {
    return new Promise(async (resolve, reject) => {
        try {
            await SocketSchema.updateOne(
                { user_id: socketData[0]['user_id'] },
                { $set: { socket_id: socket.id } }
            );
            logger.info(`Socket updated successfully for user id ${socketData[0]['user_id']} with socket id ${socket.id}`);
            resolve(true);
        } catch (err) {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            reject(err);
        }
    });
};

const createSocket = (data, socket) => {
    return new Promise(async (resolve, reject) => {
        try {
            data['socket_id'] = socket.id;
            const socketSchema = new SocketSchema(data);
            await socketSchema.save();
            logger.info(`Socket created successfully for user id ${data['user_id']} with socket id ${socket.id}`);
            resolve(true);
        } catch (err) {
            if (err.code === 11000) {
                logger.error(`${Object.keys(err.keyValue)} already exists`);
                resolve(false);
            } else {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                reject(err);
            }
        }
    });
};


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

const createGroupMessage = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const groupMessageSchema = new GroupMessageSchema(data);
            await groupMessageSchema.save().then(result => {
                logger.info(messageConstants.MESSAGE_SAVED_SUCCESS, result);
                return resolve(result);
            });
        } catch (err) {
            logger.error(messageConstants.MESSAGE_CREATION_FAILED, err);
            return reject(err);
        }
    });
};

const updateMessage = async (messageId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedMessage = await MessageSchema.findByIdAndUpdate(
                messageId,
                { $set: data },
                { new: true } 
            );

            if (!updatedMessage) {
                logger.error(messageConstants.MESSAGE_NOT_FOUND);
                return reject(messageConstants.MESSAGE_NOT_FOUND);
            }

            logger.info(messageConstants.MESSAGE_UPDATED_SUCCESS, updatedMessage);
            return resolve(updatedMessage);
        } catch (err) {
            logger.error(messageConstants.MESSAGE_UPDATE_FAILED, err);
            return reject(err);
        }
    });
};

const updateGroupMessage = async (messageId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedMessage = await GroupMessageSchema.findByIdAndUpdate(
                messageId,
                { $set: data },
                { new: true }
            );

            if (!updatedMessage) {
                logger.error(messageConstants.MESSAGE_NOT_FOUND);
                return reject(messageConstants.MESSAGE_NOT_FOUND);
            }

            logger.info(messageConstants.MESSAGE_UPDATED_SUCCESS, updatedMessage);
            return resolve(updatedMessage);
        } catch (err) {
            logger.error(messageConstants.MESSAGE_UPDATE_FAILED, err);
            return reject(err);
        }
    });
};


const deleteMessage = async (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedMessage = await MessageSchema.findByIdAndDelete(messageId);

            if (!deletedMessage) {
                logger.error(messageConstants.MESSAGE_NOT_FOUND);
                return reject(messageConstants.MESSAGE_NOT_FOUND);
            }

            logger.info(messageConstants.MESSAGE_DELETED_SUCCESS, deletedMessage);
            return resolve(deletedMessage);
        } catch (err) {
            logger.error(messageConstants.MESSAGE_DELETE_FAILED, err);
            return reject(err);
        }
    });
};

const deleteGroupMessage = async (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedMessage = await GroupMessageSchema.findByIdAndDelete(messageId);

            if (!deletedMessage) {
                logger.error(messageConstants.MESSAGE_NOT_FOUND);
                return reject(messageConstants.MESSAGE_NOT_FOUND);
            }

            logger.info(messageConstants.MESSAGE_DELETED_SUCCESS, deletedMessage);
            return resolve(deletedMessage);
        } catch (err) {
            logger.error(messageConstants.MESSAGE_DELETE_FAILED, err);
            return reject(err);
        }
    });
};

