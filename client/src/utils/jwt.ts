import jwtDecode from 'jwt-decode';
//
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
    if (!accessToken) {
        return false;
    }
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};

let expiredTimer: null | number = null;

const handleTokenExpired = (exp: number) => {
    if (expiredTimer) {
        clearTimeout(expiredTimer);
    }

    const currentTime = Date.now();
    const timeLeft = exp * 1000 - currentTime;
    console.log("Session timeout after: " + timeLeft);
    expiredTimer = window.setTimeout(async () => {
        delete axios.defaults.headers.common["Authorization"];
        console.log("Session expired");
        setSession(null);
    }, timeLeft);
};

const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        const {exp} = jwtDecode<{ exp: number }>(accessToken);
        handleTokenExpired(exp);
    } else {
        localStorage.removeItem('accessToken');
        if (expiredTimer) {
            clearTimeout(expiredTimer);
        }
        delete axios.defaults.headers.common.Authorization;
    }
};

export {isValidToken, setSession};
