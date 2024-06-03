import { post } from "../services/apiHandler"

export const createSession = async () => {
    return await post('/session')
}