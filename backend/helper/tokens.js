let jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    encrypt: async function (session) {
        try {
            const accessTokenExpiresIn = '1h';
            return await jwt.sign({sessionId:session}, process.env.JWTKEY, { expiresIn: accessTokenExpiresIn });
        } catch (error) {
            throw error;
        }
    },
    decrypt: function (token) {
        try {
            return jwt.verify(token, process.env.JWTKEY);
        } catch (err) {
            return null;
        }
    },
    verifyToken: function (req, res, next) {
        if (!req.headers?.authorization || !req.headers?.authorization.split(" ")[1]) {
            return res.status(401).json({ message: 'Unauthorized - Token not provided' });
        }
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.JWTKEY, (err, decoded) => {

            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized - Token expired' });
                }
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }

            req.loginedUser = decoded;
            next();
        });
    }
};