import axios from "../utils/axios";

export const healthCheckBackend = async () => {
    return (await axios.get('/Status/health-check', )).data;
}

export const loginCheckBackend = async () => {
    return (await axios.get('/Status/login-check', )).data;
}