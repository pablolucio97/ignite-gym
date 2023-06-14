import { AppError } from '@utils/AppError'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.56.1:3333'
})

//RETURNS DIFFERENT MESSAGES BASED ON THE TYPE OF ERROR RETURNED BY THE SERVER
//THE SERVER CAN RETURN GENERIC OU SPECIFICS MESSAGE ERRORS

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message))
    }else{
        return Promise.reject(new AppError(error))
    }
})

export { api }