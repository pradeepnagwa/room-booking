const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Rooms = new Schema({
    name: {
        type: String,
        required: true
    },
    facilities: {
        type: Array,
        default: [],
        required: true
    },
    currentlyAvailable: {
        type: Boolean,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Rooms', Rooms, "Rooms");
