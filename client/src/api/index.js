import axios from 'axios';

export default axios.create({
    baseURL: process.env.NODE_ENV === "production" ? "http://159.65.255.51:80/" : "http://localhost:4000"
});