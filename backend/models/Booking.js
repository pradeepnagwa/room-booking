const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const Bookings = new Schema({
    roomId: {
        type: mongoose.Types.ObjectId,
        ref: 'Rooms',
        required: true
    },
    sessionId: {
        type: mongoose.Types.ObjectId,
        ref: 'Sessions',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bookings', Bookings, "Bookings")