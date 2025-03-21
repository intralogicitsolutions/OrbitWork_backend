const chatSocket = require('./chat')

module.exports = (io) => {
    chatSocket(io);
}