const mailer = require('nodemailer');
const logger = require('./logger');

const smtpProtocol = mailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendMailToUser = (template, receiver, subject, res, content) => {
    res.render(template, { receiver, content }, (err, data) => {
        if (err) {
            logger.error('Error in rendering template.', err);
        } else {
            const mailoption = {
                from: process.env.EMAIL_USER,
                to: receiver,
                subject: subject,
                html: data
            }

            smtpProtocol.sendMail(mailoption, function (err, response) {
                if (err) {
                    smtpProtocol.close();
                    return logger.error('Error in sending email.', err);
                }
                logger.info(`Email sent successfully to ${content.firstname} ${content.lastname}`);
                smtpProtocol.close();
            });
        }
    })
}

module.exports = {
    sendMailToUser,
};