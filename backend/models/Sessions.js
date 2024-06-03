const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Sessions = new Schema({
    sessionId: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Sessions', Sessions, "Sessions");
