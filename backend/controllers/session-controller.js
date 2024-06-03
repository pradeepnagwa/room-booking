const { generateSessionId } = require('../helper/session');
const tokens = require('../helper/tokens');
const Sessions = require('../models/Sessions');

module.exports = {
    createSession: async function () {
        try {
            const sessionId = await generateSessionId();
            const accessToken = await tokens.encrypt(sessionId);
          const session =  await Sessions.create({ sessionId });
            return { accessToken, sessionId: session._id };
        } catch (error) {
            throw error;
        }
    },


}
