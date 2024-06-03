const express = require('express');

const router = express.Router();
const sessionCtrl = require('../controllers/session-controller');
const roomCtrl = require('../controllers/room-controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/session', (req, res) => {
    sessionCtrl.createSession().then((data) => {
        res.status(200).json({
            data: data,
            message: 'session created successful'
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
})


router.get('/rooms', authMiddleware, (req, res, next) => {
    roomCtrl.getRoooms(req).then((data) => {
        res.status(200).json({
            data: data
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
})
router.get('/rooms/:id', authMiddleware, (req, res, next) => {
    roomCtrl.getRoomById(req).then((data) => {
        res.status(200).json({
            data: data
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
})

router.get('/bookings/:id', authMiddleware, (req, res, next) => {
    roomCtrl.getBookingDetailsById(req).then((data) => {
        res.status(200).json({
            data: data
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
})
router.post('/bookings', authMiddleware, (req, res, next) => {
    roomCtrl.bookRoom(req).then((data) => {
        res.status(200).json({
            data: data
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
})

module.exports = router