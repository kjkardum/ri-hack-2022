import axios from 'axios';

const axiosInstance = axios.create({baseURL: process.env.HOST_API_KEY || HOST_API_KEY});

axiosInstance.interceptors.request.use(
    function (config) {
        if(config.headers)
            config.headers["Authorization"] = `Bearer ${localStorage.getItem('accessToken')}`;
        return config;
    }, function (error: any) {
        return Promise.reject(error);
    });

export default axiosInstance;