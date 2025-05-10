import axios from 'axios';

export const apiInstanceExpress = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_RAILWAY,
    headers: {
        'Content-Type': 'application/json',
    },
});