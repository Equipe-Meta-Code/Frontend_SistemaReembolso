import axios from "axios";

const api2 = axios.create({
    baseURL: 'http://192.168.1.18:3333/'
});

export default api2;