let tokens = require('./tokens');

module.exports = function (token) {
    return tokens.decrypt(token);
};