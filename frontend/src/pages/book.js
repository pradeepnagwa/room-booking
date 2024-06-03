import React from 'react';
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { bookRoom, getBookingDetailsById, getRoomDetailsById, getSlotByDateFilter } from '../apis/rooms';
import socket from '../socket';

const RoomBook = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedRoomDetails, setSelectedRoomDetails] = React.useState({});
    const [bookingDetails, setBookingDetails] = React.useState({});
    const [timeSlots, setTimeSlots] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedSlot, setSelectedSlot] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [bookinBySlots, setBookingBySlots] = React.useState([])

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const navigate = useNavigate();

    const daysInMonth = (month, year) => {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const monthStartDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());


    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            date = new Date();
        }

        let d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    const formatTime = (time) => {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let suffix = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${suffix}`;
    };


    const generateTimeSlots = () => {
        const slots = [];
        let startTime = new Date(0, 0, 0, 10, 0);
        while (startTime.getHours() < 19) {
            const endTime = new Date(startTime.getTime());
            endTime.setMinutes(endTime.getMinutes() + 30);
            const slotString = formatTime(startTime) + " - " + formatTime(endTime);
            slots.push(slotString);
            startTime = endTime;
        }
        setTimeSlots(slots);
    };

    const getRoomDetails = async () => {
        const id = new URL(window.location.href).pathname.split('/').pop();
        await getRoomDetailsById(id).then((res) => {
            if (res.data) {
                setSelectedRoomDetails(res.data)
                getBookingDetils(id)
                getSlotByDate()
            } else {
                navigate(`/`)
            }
        }, (error) => {
            navigate(`/`)

            setSelectedRoomDetails({})
        })
    }

    //To get time slot as per selected date
    const getSlotByDate = async () => {
        const id = new URL(window.location.href).pathname.split('/').pop();
        await getSlotByDateFilter(id, formatDate(new Date(selectedDate) || currentDate)).then((res) => {
            if (res.data) {
                setBookingBySlots(res.data)
            }
        })
    }

    //To get booking details based on room  id
    const getBookingDetils = async (id) => {
        await getBookingDetailsById(id).then((res) => {
            console.log(res.data)
            if (res.data) {
                setBookingDetails(res.data)
            }
        })
    }
   
    const handleBookRoom = async () => {
        setError('');
        if (!selectedDate || !selectedSlot) {
            setError('Please select date and time')
        }

        const bookingDetails = {
            roomId: selectedRoomDetails._id,
            bookingDate: new Date(selectedDate),
            bookingTime: selectedSlot
        }

        await bookRoom(bookingDetails).then((res) => {
            if (res.data) {
                setSuccess('Room booked successfully');
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
                getRoomDetails();
                setSelectedDate('');
                setSelectedSlot('');
                // navigate(`/`)
            }
        })
    }
    const isSlotAvailable = (slot) => {
        let isBooked = false;
        let isSelfBook = false;
        for (const booking of bookinBySlots) {
            if (booking.bookingTime == slot) {
                isBooked = true;
                if (booking.sessionId == localStorage.getItem('sessionId')) {
                    isSelfBook = true;
                    break;
                }
            }
        }

        return isSelfBook ? 'self' : isBooked ? 'booked' : 'available';
    }

    const isDateAvailable = (date) => {
        if (Object.keys(bookingDetails).length > 0) {
            const formattedInputDate = formatDate(date);
            let isBooked = false;
            let isSelfBook = false;

            for (const booking of bookingDetails) {
                const bookingDate = new Date(booking.bookingDate);
                if (formatDate(bookingDate) === formattedInputDate) {
                    isBooked = true;
                    if (booking.sessionId === localStorage.getItem('sessionId')) {
                        isSelfBook = true;
                        break;
                    }
                }
            }
            return isSelfBook ? 'self' : isBooked ? 'booked' : 'available';
        }
        return 'available';
    };
    React.useEffect(() => {
        getSlotByDate()
    }, [selectedDate]);

    React.useEffect(() => {
        getRoomDetails()
        generateTimeSlots()
        socket.on('booking_update', (updatedRoomDetails) => {
            getRoomDetails()
        });
        return () => {
            socket.off('booking_update');
        };
    }, []);

    return (
        <Container>
            <Row className="mt-3">
                <Col md={12}>
                    <h4>Room booking for {selectedRoomDetails.name || ''}</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                </Col>

            </Row>
            {selectedRoomDetails && selectedRoomDetails.currentlyAvailable ?
                (<div><Row className="mt-3">
                    <Col md={6}>
                        <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                        <div className="calendar">
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className="day-of-week">
                                    {day}
                                </div>
                            ))}
                            {Array(monthStartDay).fill(null).map((_, index) => (
                                <div key={index} ></div>
                            ))}
                            {days.map((day, index) => (
                                <div
                                    key={index}
                                    className={`day ${isDateAvailable(day) === 'self' ? 'bg-success' : (isDateAvailable(day) === 'booked' ? 'bg-danger' : '')} ${formatDate(day) === formatDate(currentDate) ? 'current-date' : ''} ${selectedDate === formatDate(day) ? 'selected-date' : ''}`}
                                    onClick={() => setSelectedDate(formatDate(day))}
                                >
                                    {day.getDate()}
                                </div>
                            ))}



                        </div>
                    </Col>

                    <Col md={6}>
                        <h3>Booking Section</h3>
                        <div className='text-end'>
                            <div>
                                {selectedRoomDetails.facilities && selectedRoomDetails.facilities.map((facility, index) => (
                                    <span key={index} className='badge bg-primary'>{facility}</span>
                                ))}
                            </div>
                            <p>{selectedRoomDetails.capacity || 0} seat capacity</p>
                            <Button variant="primary" onClick={() => handleBookRoom()} disabled={!selectedDate || !selectedSlot}>Book</Button>
                        </div>
                    </Col>
                </Row>
                    <Row className="mt-3">
                        <Col md={12}>
                            <div className="time-slots">
                                {timeSlots.map((slot, index) => (
                                    <Button
                                        key={index}
                                        variant={isSlotAvailable(slot) === 'booked' ? 'danger' : (isSlotAvailable(slot) === 'self' ? 'success' : 'info')}
                                        className={`time-slot`}
                                        disabled={isSlotAvailable(slot) === 'booked' || isSlotAvailable(slot) === 'self'}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </div>

                        </Col>
                    </Row>
                </div>) :
                <h1>Currently not available</h1>
            }

        </Container >
    );
}

export default RoomBook;
