import axios from "axios";

const api2 = axios.create({
    baseURL: 'http://<ip-da-sua-maquina>.1:3333/'
});

export default api2;