const UserSchema = require('../../models/user');
const { responseData, messageConstants, mailTemplateConstants, mailSubjectConstants } = require('../../constants');
const { jsonWebToken, cryptoGraphy } = require('../../middleware');
const { logger, mail } = require('../../utils');

const signUp = async (body, res) => {
    return new Promise(async () => {
        body['password'] = await cryptoGraphy.hashPassword(body.password);
        const userSchema = new UserSchema(body);
        const mailContent = {
            firstname: body.firstname,
            lastname: body.lastname
        }
        await userSchema.save().then(async (result) => {
            logger.info(`User ${body['firstname']} ${body['lastname']} created successfully with ${body['email']}`);
            await mail.sendMailToUser(mailTemplateConstants.SIGNUP_TEMPLATE, body.email, mailSubjectConstants.SIGNUP_SUBJECT, res, mailContent);
            return responseData.success(res, result, messageConstants.USER_CREATED);
        }).catch((err) => {
            if (err.code === 11000) {
                logger.error(`${Object.keys(err.keyValue)} already exists`);
                return responseData.fail(res, `${Object.keys(err.keyValue)} already exists `, 403);
            } else {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            }
        })
    })
}

const signIn = async (body, res) => {
    return new Promise(async () => {
        await UserSchema.findOne({ email: body.email }).then(async (result) => {
            if (result) {
                const isMatch = await cryptoGraphy.comparePassword(body?.password, result?.password);
                if (isMatch) {
                    await createJsonWebTokenForUser(result)
                    logger.info(`User ${result['firstname']} ${result['lastname']} ${messageConstants.LOGGEDIN_SUCCESSFULLY}`);
                    return responseData.success(res, result, `User ${messageConstants.LOGGEDIN_SUCCESSFULLY}`);
                } else {
                    return responseData.fail(res, messageConstants.EMAIL_PASS_INCORRECT, 401)
                }
            } else {
                logger.error(messageConstants.USER_NOT_FOUND);
                return responseData.fail(res, messageConstants.USER_NOT_FOUND, 404)
            }
        }).catch((err) => {
            logger.error(messageConstants.USER_NOT_FOUND, err);
            return responseData.fail(res, messageConstants.USER_NOT_FOUND, 404)
        })
    })
}

const createJsonWebTokenForUser = async (user) => {
    user['token'] = await jsonWebToken.createToken(user['_id'])
    await UserSchema.updateOne(
        {
            _id: user['_id']
        },
        {
            $set: { token: user['token'] }
        }
    );
    delete user?._doc?.password;
}

module.exports = {
    signUp,
    signIn
}