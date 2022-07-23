import axios from 'axios';
import {environment} from "../environment";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({baseURL: environment.base_url});

export default axiosInstance;
