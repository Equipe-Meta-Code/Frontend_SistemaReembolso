import axios from 'axios';

const api = axios.create({
    baseURL: 'https://67dd4f36e00db03c406b1343.mockapi.io/api/projetos'
});

export default api;