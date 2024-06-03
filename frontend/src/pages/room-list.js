import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../apis/auth';
import { getAllRooms } from '../apis/rooms';

const RoomList = () => {
    const [query, setQuery] = React.useState('');
    const [filter, setFilter] = React.useState('all');
    const [rooms, setRooms] = React.useState([]);
    const navigate = useNavigate();

    const createSessionID = async () => {
        await createSession().then((res) => {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('sessionId', res.data.sessionId);
            getAllRoomList();
        }, (error) => {
            console.log(error)
        })
    }
    const getAllRoomList = async () => {
        const filterObj = {
            filter: filter,
            query: query
        }
        
        await getAllRooms(filterObj).then((res) => {
            setRooms(res.data)
        }, (error) => {
            console.log(error)
        })
    }
    React.useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            createSessionID();
        } else {
            getAllRoomList();
        }
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        getAllRoomList()
    }
    return (
        <Container>
            <Row className="mt-3 text-center">
                <Col md={12}>
                    <h1>Room Booking App</h1>
                    <Form onSubmit={handleSearch} className='d-flex justify-content-center'>
                        <Form.Group>
                            <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">All</option>
                                <option value="room">Room</option>
                                <option value="facilities">Facilities</option>
                                <option value="availability">Availability</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Search rooms..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Search</Button>
                    </Form>
                </Col>
                <Col md={12} className="mt-3">
                    <span className='badge bg-primary'>Total rooms: {rooms.length}</span>
                    {rooms.map((room, index) => (
                        <div key={index} role="button" className='m-1 p-1 border rounded d-flex justify-content-between' onClick={() => navigate(`/book/${room._id}`)}>
                            <div className='text-start'>
                                <h3>{room.name}</h3>
                                <p>{room.currentlyAvailable ? 'currently available' : 'not available'}</p>
                            </div>
                            <div>
                                <div className='text-end'>
                                    {room.facilities.map((facility, index) => (
                                        <span key={index} className='badge bg-primary'>{facility}</span>
                                    ))}
                                </div>
                                <p>{room.capacity} seat capacity</p>
                            </div>
                        </div>
                    ))}

                </Col>
            </Row>
        </Container>
    )
}

export default RoomList