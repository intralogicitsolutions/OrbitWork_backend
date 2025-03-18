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

const updateRoom = async (req, userDetails, res) => {
    return new Promise(async () => {
        try{
            const { id: roomId } = req.params;
            const {addMembers = [], removeMembers = [], ...updateData} = req.body;
            const userId = userDetails._id; 
            
            if (!roomId){
                return responseData.fail(res, messageConstants.ROOM_ID_REQUIRED, 400);
            }

            const existingRoom = await RoomSchema.findOne({_id: roomId, user_id: userId});
            if (!existingRoom){
                logger.warn(messageConstants.ROOM_NOT_FOUND);
                return responseData.fail(res, messageConstants.ROOM_NOT_FOUND, 404);
            }

            let updatedMembers = new Set(existingRoom.members.map(member => member.toString()));
            addMembers.forEach(memberId => updatedMembers.add(memberId));
            removeMembers.forEach(memberId => updatedMembers.delete(memberId));
            updateData.members = Array.from(updatedMembers);

            const updatedRoom = await RoomSchema.findOneAndUpdate(
                { _id: roomId, user_id: userId},
                { $set: {
                    ...updateData,
                }
                },
                { new: true, runValidators: true}
            );

            if(!updatedRoom) {
                logger.warn(messageConstants.ROOM_NOT_FOUND);
                return responseData.fail(res, messageConstants.ROOM_NOT_FOUND, 404);
            }

            logger.info(messageConstants.ROOM_UPDATE_SUCCESS);
            return responseData.success(res, updatedRoom, messageConstants.ROOM_UPDATE_SUCCESS);

        }catch(error){
            logger.error(`Error updating room: ${erro.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
}



// const updateRoom = async (req, userDetails, res) => {
//     return new Promise(async () => {
//         try{
//             const { id: roomId } = req.params;
//             const updateData = req.body;
//             const userId = userDetails?._id; 

//               if (!roomId) {
//                     return responseData.fail(res, messageConstants.ROOM_ID_REQUIRED, 400);
//                 }
//              const existingRoom = await RoomSchema.findOne({ _id: roomId, user_id: userId });

//              if (!existingRoom) {
//                   logger.warn(messageConstants.ROOM_NOT_FOUND);
//                      return responseData.fail(res, messageConstants.ROOM_NOT_FOUND, 404);
//              }

//              let updatedMembers = new Set(existingRoom.members); 

//              // Handle Member Add/Remove Logic
//         if (updateData.members && Array.isArray(updateData.members)) {
//             const { action, members } = updateData;  // Expecting `{ action: "add" | "remove", members: [...] }`

//             if (!action || !["add", "remove"].includes(action)) {
//                 return responseData.fail(res, messageConstants.INVALID_ACTION, 400);
//             }

//             if (action === "add") {
//                 // Add new members (avoid duplicates)
//                 updatedMembers = [...new Set([...updatedMembers, ...members])];
//             } else if (action === "remove") {
//                 // Remove specified members
//                 updatedMembers = existingRoom.members.filter(m => !members.includes(m));
//             }

//             // Save room after modifying members
//           //  await existingRoom.save();
//         }

//              const updatedRoom = await RoomSchema.findOneAndUpdate(
//                              { _id: roomId, user_id: userId },  
//                              { $set: {
//                                  ...updateData,
//                                  members: updatedMembers
//                               } },          
//                              { new: true, runValidators: true } 
//                          );
            
//              if (!updatedRoom) {
//                         logger.warn(messageConstants.ROOM_NOT_FOUND);
//                          return responseData.fail(res, messageConstants.ROOM_NOT_FOUND, 404);
//                  }
//                  logger.info(messageConstants.ROOM_UPDATE_SUCCESS);
//                  return responseData.success(res, updatedRoom, messageConstants.ROOM_UPDATE_SUCCESS);

//         }catch(error){
//              logger.error(`Error updating room: ${error.message}`);
//                         return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
//         }
//     });
// }

module.exports = {
    createRoom,
    updateRoom
}