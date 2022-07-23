import axios from "../utils/axios";

export const loginAccount = async (email: string, password: string) => {
    return (await axios.post('/Account/Login', {
        email,
        password,
    })).data;
}

export const registerAccount = async (email: string, password: string, repeatPassword: string) => {
    return (await axios.post('/Account/Register', {
        email,
        password,
        repeatPassword,
    })).data;
}

export const forgotAccountPassword = async (email: string) => {
    return (await axios.post('/Account/ForgotPassword', {
        email,
    })).data;
}

export const changeAccountPassword = async (email: string, currentPassword: string, password: string, confirmPassword: string) => {
    return (await axios.post('/Account/ChangePassword', {
        email,
        currentPassword,
        password,
        confirmPassword,
    })).data;
}

export const checkEmailTaken = async (email: string) => {
    return (await axios.post<boolean>('/Account/CheckEmailTaken', {
        email,
    })).data;
}