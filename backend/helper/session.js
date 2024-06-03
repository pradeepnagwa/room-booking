const crypto = require('crypto');

module.exports = {
    generateSessionId: function () {
        const now = Date.now();
        const randomData = crypto.randomBytes(8).toString('hex');
        const hash = crypto.createHash('sha256');
        hash.update(`${now}-${randomData}`);
        return hash.digest('hex');
    }
}