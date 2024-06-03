const Booking = require('../models/Booking');
const Rooms = require('../models/Rooms');
const Sessions = require('../models/Sessions');
const io = require('../helper/socket');
const { getIo } = require('../helper/socket');
module.exports = {
    getRoooms: async function (req) {
        try {
            console.log('getting ', req.query)
            const sessionId = await Sessions.findOne({ sessionId: req.sessionId }).lean();
            if (!sessionId) {
                throw new Error('Session not found');
            }
            if (req.query.filter == 'availability') {
                return await Rooms.find({ currentlyAvailable: true }).lean();

            } else if (req.query.filter == 'room') {
                return await Rooms.find({ name: { $regex: req.query.query, $options: 'i' } }).lean();
            } else if (req.query.filter == 'facilities') {
                return await Rooms.find({
                    facilities: { $regex: req.query.query, $options: 'i' }
                }).lean();
            }

            return await Rooms.find().lean();
        }
        catch (error) {
            throw error;
        }
    },
    getRoomById: async function (req) {
        try {
            if (!req.params.id) {
                throw new Error('Room not found');
            }
            return await Rooms.findOne({ _id: req.params.id }).lean();
        }
        catch (error) {
            throw error;
        }
    },
    getSlotsByDate: async function (req) {
        try {
            if (!req.query.date) {
                throw new Error('Date not found');
            }
            if (!req.params.id) {
                throw new Error('Room not found');
            }
            return await Booking.find({ bookingDate: req.params.date }).lean();
        }
        catch (error) {
            throw error;
        }
    },
    getBookingDetailsById: async function (req) {
        try {
            if (!req.params.id) {
                throw new Error('Room not found');
            }
            if (req.query.date) {
                const startDate = new Date(req.query.date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);

                const bookingList = await Booking.find({
                    bookingDate: { $gte: startDate, $lt: endDate },
                    roomId: req.params.id
                }).lean();

                console.log(bookingList);

                return bookingList.map((booking) => {
                    if (Array.isArray(booking.bookingTime)) {
                        booking.bookingTime = booking.bookingTime.join(',');
                    }
                    return booking;
                });
            }

            return await Booking.find({ roomId: req.params.id }).lean();
        }
        catch (error) {
            throw error;
        }
    },
    bookRoom: async function (req) {
        try {
            // if (!req.params.id) {
            //     throw new Error('Room not found');
            // }
            if (!req.sessionId) {
                throw new Error('Session not found');
            }

            const session = await Sessions.findOne({ sessionId: req.sessionId }).lean();
            req.body.sessionId = session._id;
            await Booking.create(req.body);

            const io = getIo();
            return io.emit('booking_update', {
                message: 'New booking created!',
            });

        }
        catch (error) {
            throw error;
        }
    }
}