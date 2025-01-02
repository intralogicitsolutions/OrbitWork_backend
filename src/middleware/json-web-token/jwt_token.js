const jwt = require('jsonwebtoken');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const UserSchema = require('../../models/user');

function generateToken(id) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: id
    }
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: '8h' });
    logger.info(messageConstants.TOKEN_GENERATED);
    return token;
}

async function validateToken(req, res, next, userToken = '') {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header('authorization') || userToken;
        // const authHeader = req.header('authorization') || userToken;
        // const token = authHeader.startsWith('Bearer ') 
        //     ? authHeader.split(' ')[1] 
        //     : userToken;

        if (token) {
            const verified = jwt.verify(token, jwtSecretKey);
            if (verified) {
                const userDetails = await UserSchema.findOne({ _id: verified?.userId });
                if (userDetails?.token !== token) {
                    logger.error(messageConstants.TOKEN_EXPIRED);
                    res.status(401).send(responseData.tokenExpired);
                } else {
                    logger.info(messageConstants.TOKEN_VALIDATED);
                    req.userDetails = userDetails;
                    next();
                }
            } else {
                logger.error(`${messageConstants.USER_NOT_FOUND} ${messageConstants.TOKEN_EXPIRED}`);
                res.status(401).send(responseData.unauthorized)
            }
        } else {
            res.status(400).send(responseData.tokenRequired)
        }

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.error(messageConstants.TOKEN_EXPIRED);
            res.status(401).send(responseData.tokenExpired);
        } else {
            logger.error(messageConstants.TOKEN_INVALID);
            res.status(401).send(responseData.unauthorized);
        }
    }
}


module.exports = {
    createToken: generateToken,
    validateToken: validateToken,
}