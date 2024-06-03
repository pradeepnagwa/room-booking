import { get, post } from "../services/apiHandler"

export const getAllRooms = async (filterObj) => {
    
    if (filterObj.filter == 'facilities' || filterObj.filter == 'room') {
        return await get(`/rooms?filter=${filterObj.filter}&query=${filterObj.query}`)
    }
    return await get('/rooms?filter=' + filterObj.filter)
}

export const getRoomDetailsById = async (id) => {
    return await get(`/rooms/${id}`)
}
export const getBookingDetailsById = async (id) => {
    return await get(`/bookings/${id}`)
}

export const bookRoom = async (data) => {
    return await post('/bookings', data)
}

export const getSlotByDateFilter = async (id,date) => {
    return await get(`/bookings/${id}?date=${date}`)
}