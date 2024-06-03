const crypto = require('crypto');
require('dotenv').config();
let secret = 'test@1234';
const algo = 'aes-256-cbc';

module.exports = {
    hash: function (str) {
        try {
            const hashedPassword = crypto.createHmac('sha256', secret)
                .update(str)
                .digest('hex');
            return hashedPassword;
        } catch (error) {
            throw error;
        }
    },
    verifyHash: function (str, hashedPwd) {
        let passwordHash = this.hash(str);
        return passwordHash === hashedPwd;
    },
    encrypt: function (str) {
        try {
            const iv = crypto.randomBytes(16);
            let cipher = crypto.createCipheriv(algo, config.key, iv);
            let encrypted = cipher.update(str);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString('hex'), encrypted: encrypted.toString('hex') };
        } catch (error) {
            throw error;
        }
    },
    decrypt: function (ivData, encryptedData) {
        try {
            let encryptedText = Buffer.from(encryptedData, 'hex');
            let iv = Buffer.from(ivData, 'hex');
            let decipher = crypto.createDecipheriv(algo, config.key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            throw error;
        }
    }
}