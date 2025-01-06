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
            delete result?.password;
            logger.info(`User ${body['firstname']} ${body['lastname']} created successfully with ${body['email']}`);
            await mail.sendMailToUser(mailTemplateConstants.SIGNUP_TEMPLATE, body.email, mailSubjectConstants.SIGNUP_SUBJECT, res, mailContent);
            return responseData.success(res, result, messageConstants.USER_CREATED);
        }).catch((err) => {
            if (err.code === 11000) {
                logger.error(`${Object.keys(err.keyValue)} already exists`);
                return responseData.fail(res, `${Object.keys(err.keyValue)} already exists `, 403);
            } else {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
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
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500)
        })
    })
}

const forgotPassword = async (req, res, next) => {
    return new Promise(async () => {
        await UserSchema.findOne({ email: req.body.email }).then(async (user) => {
            if (user) {
                if (user.token) {
                    await jsonWebToken.validateToken(req, res, next, user.token)
                } else {
                    await createJsonWebTokenForUser(user);
                }
                await forgotPasswordLink(res, user);
            } else {
                logger.error(messageConstants.USER_NOT_FOUND);
                return responseData.fail(res, messageConstants.USER_NOT_FOUND, 404)
            }
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500)
        })
    })
}

const resetPassword = async (body, res) => {
    return new Promise(async () => {
        // body['old_password'] = cryptoGraphy.encrypt(body.old_password);
        const user = await UserSchema.findOne({ _id: userData._id });

        const isMatch = await cryptoGraphy.comparePassword(body.old_password, user.password);
        if (!isMatch) {
            logger.error(`${messageConstants.OLD_PASSWORD_NOT_MATCHED} with ${body.old_password}`);
            return responseData.fail(res, messageConstants.OLD_PASSWORD_NOT_MATCHED, 403)
        } else {
            body['new_password'] = await cryptoGraphy.hashPassword(body.new_password);
            await UserSchema.findOneAndUpdate(
                {
                    _id: user._id
                },
                {
                    password: body['new_password']
                }
            ).then(async (result) => {
                if (result.length !== 0) {
                    const mailContent = {
                        firstname: user.firstname,
                        lastname: user.lastname
                    }
                    await mail.sendMailToUser(mailTemplateConstants.RESET_PASS_TEMPLATE, user.email, mailSubjectConstants.RESET_PASS_SUBJECT, res, mailContent);
                    logger.info(`${messageConstants.PASSWORD_RESET} for ${user.email}`);
                    return responseData.success(res, {}, messageConstants.PASSWORD_RESET);
                } else {
                    logger.error(`${messageConstants.PASSWORD_NOT_RESET} for ${user.email}`);
                    return responseData.fail(res, messageConstants.PASSWORD_NOT_RESET, 403);
                }
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500)
            })
        }

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
};

const forgotPasswordLink = async (res, user) => {
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${user.token}`;
    const mailContent = {
        firstname: user.firstname,
        lastname: user.lastname,
        link: link
    }
    await mail.sendMailToUser(mailTemplateConstants.FORGOT_PASS_TEMPLATE, user.email, mailSubjectConstants.FORGOT_PASS_SUBJECT, res, mailContent);
    return responseData.success(res, {}, messageConstants.EMAIL_SENT_FORGOT_PASSWORD);
}

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    resetPassword
}