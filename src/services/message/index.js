const MessageSchema = require('../../models/message');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { io } = require('../../index');
const mongoose = require("mongoose");

const sendMessage = async (body, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { sender_id, receiver_id, message } = body;

            if (!sender_id || !receiver_id || !message) {
                logger.error(messageConstants.ALL_FIELDS_REQUIRED);
                return responseData.fail(res, messageConstants.ALL_FIELDS_REQUIRED, 400);
            }

            const newMessage = new MessageSchema({ sender_id, receiver_id, message });
            const savedMessage = await newMessage.save();

            if (io) {
                io.to(receiver_id).emit('receiveMessage', savedMessage);
            } else {
                logger.error("Socket.io is not initialized");
            }

            logger.info(messageConstants.MESSAGE_SENT_SUCCESS);
            return responseData.success(res, savedMessage, messageConstants.MESSAGE_SENT_SUCCESS);

        } catch (error) {
            logger.error(messageConstants.MESSAGE_SENT_FAILED, error);
            return responseData.fail(res, messageConstants.MESSAGE_SENT_FAILED, 500);
        }
    });
};

const getMessage = async (body, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { sender_id, receiver_id } = body;

            if (!sender_id || !receiver_id) {
                logger.error(messageConstants.ALL_FIELDS_REQUIRED);
                return responseData.fail(res, messageConstants.ALL_FIELDS_REQUIRED, 400);
            }

            const messages = await MessageSchema.find({
                $or: [
                    { sender_id, receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id }
                ]
            }).sort({ createdAt: 1 }); 

            logger.info(messageConstants.MESSAGE_FETCH_SUCCESS);
            return responseData.success(res, messages, messageConstants.MESSAGE_FETCH_SUCCESS);

        } catch (error) {
            logger.error(messageConstants.MESSAGE_FETCH_FAILED, error);
            return responseData.fail(res, messageConstants.MESSAGE_FETCH_FAILED, 500);
        }
    });
}

const getMessageList = async (req, user, res) => {
    return new Promise(async () => {

        let query = [];

        const senderId = new mongoose.Types.ObjectId(user._id);
        const receiverId = req.query.user_id ? new mongoose.Types.ObjectId(req.query.user_id) : null;
        const roomId = req.query.room_id ? new mongoose.Types.ObjectId(req.query.room_id) : null;

        if (roomId) {
            query = [
                { $match: { room_id: roomId } },
                { 
                    $lookup: {
                        from: "users",
                        localField: "sender_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, firstname: 1, lastname: 1, email: 1 } }],
                        as: "sender_details",
                    },
                },
                {
                    $lookup: {
                        from: "upload_files",
                        localField: "attechment_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1, url: 1, size: 1 } }],
                        as: "attechment_details",
                    },
                },
                {
                    $lookup: {
                        from: "rooms",
                        localField: "room_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1, members: 1,} }],
                        as: "room_details",
                    },
                },
                { $sort: { created_at: -1 } } 
            ];
        } 

        else if (receiverId) {
            query = [
                {
                    $match: {
                        $or: [
                            { sender_id: senderId, receiver_id: receiverId },
                            { sender_id: receiverId, receiver_id: senderId }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, firstname: 1, lastname: 1, email: 1 } }],
                        as: "sender_details",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "receiver_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, firstname: 1, lastname: 1, email: 1 } }],
                        as: "receiver_details",
                    },
                },
                {
                    $lookup: {
                        from: "upload_files",
                        localField: "attechment_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1, url: 1, size: 1 } }],
                        as: "attechment_details",
                    },
                },
                { $sort: { created_at: -1 } } // Sort by newest first
            ];
        } else {
            return responseData.fail(res, "Invalid parameters", 400);
        }

        logger.info(`Query: ${JSON.stringify(query)}`);
        await MessageSchema.aggregate(query).then(async (result) => {
           if (result.length !== 0) {
                logger.info(`Message list ${result}`);
                return responseData.success(res, result, `Message ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`Message ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.fail(res, `Message ${messageConstants.LIST_NOT_FOUND}`, 204)
            }
        }).catch(function (err) {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500)
        })

    })
}


module.exports = {
    sendMessage,
    getMessage,
    getMessageList
};
