const RoomSchema = require('../../models/room');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const mongoose = require("mongoose");

const createRoom = async (body, userDetails, res) => {

    return new Promise(async () => {
        try {
            const userId = userDetails._id; 

            if (body.members && !body.members.every(id => mongoose.Types.ObjectId.isValid(id))) {
                logger.error("Invalid member IDs provided");
                return responseData.fail(res, "Invalid member IDs", 400);
            }

            const room  = new RoomSchema({
                ...body,
                user_id: userId,
                members: body.members || []
            });

            await room.save().then( async (result) => {
                logger.info(messageConstants.ROOM_CREATE_SUCCESS);
                return responseData.success(res, result, messageConstants.ROOM_CREATE_SUCCESS);
            });
            
        } catch (error) {
           logger.error(messageConstants.MESSAGE_FETCH_FAILED, error);
            return responseData.fail(res, messageConstants.MESSAGE_FETCH_FAILED, 500);
        }
    });
}

module.exports = {
    createRoom
}