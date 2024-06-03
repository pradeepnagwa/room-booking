const userProfileOAuth2 = require("../helper/auth");

/**
 * IS_AUTHENTICATED: middleware to authenticate user using token
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports = async (req, res, next) => {
    let authorizationHeader = req.headers["authorization"];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    }

    if (token && token !== "null") {
        try {
            let payload = await userProfileOAuth2(token);
            if (payload && Date.now() < payload.exp*1000) {
                if (payload.sessionId) {
                    req.sessionId = payload.sessionId;
                    req.token = token;
                    next();
                } else {
                    return res.status(404).json({ message: 'Session not found!' });
                }
            } else {
                return res.status(401).json({ message: 'Session expired!' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error!' });
        }
    } else {
        return res.status(400).json({ message: 'No token provided.' });
    }
};
