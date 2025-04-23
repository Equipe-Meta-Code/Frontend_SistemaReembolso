import axios from "axios";

const api2 = axios.create({
    baseURL: 'http://172.18.208.1:3333/'
});

export default api2;