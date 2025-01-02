const mailSubjectConstants = {
    SIGNUP_SUBJECT: 'Welcome!',
    RESET_PASS_SUBJECT: 'Password Reset',
    FORGOT_PASS_SUBJECT: 'Forgot Password',
    FORGOTTED_PASS_SUBJECT: 'Password Change Was Successful'
}

const mailTemplateConstants = {
    SIGNUP_TEMPLATE: 'signup_template.ejs',
    RESET_PASS_TEMPLATE: 'reset_password_template.ejs',
    FORGOT_PASS_TEMPLATE: 'forgot_password_template.ejs',
    FORGOTTED_PASS_TEMPLATE: 'forgotted_password_template.ejs'
}

module.exports = { mailSubjectConstants, mailTemplateConstants };