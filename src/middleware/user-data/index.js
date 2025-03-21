const { responseData, messageConstants } = require('../../constants');
const UserSchema = require('../../models/user');
const { logger } = require('../../utils');

const getUserData = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const token = req.header('token');
        await UserSchema.find({ token }).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`User ${result[0]['firstname']} ${result[0]['lastname']} fetched successfully`);
                return resolve(result[0]);
            } else {
                logger.error(messageConstants.TOKEN_EXPIRED);
                res.status(401).send(responseData.unauthorized);
            }
        }).catch((err) => { 
            logger.error(messageConstants.USER_NOT_FOUND, err);
            return reject(messageConstants.USER_NOT_FOUND);
        })
    })

}


module.exports = {
    getUserData
}