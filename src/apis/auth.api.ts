import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const signin = (payload: any) => {
    return axios.post(`${ENV.API_URL}/login`, payload);
};

export const signup = (payload: any) => {
    return axios.post(`${ENV.API_URL}/signup`, payload);
};

export const googleOauth = (payload: any) => {
    return axios.post(`${ENV.API_URL}/users/social_auth/google`, payload);
};

export const linkedInOauth = (payload: any) => {
    return axios.post(`${ENV.API_URL}/users/social_auth/linkedin`, payload);
};

export const logout = (token: string) => {
    return axios.delete(`${ENV.API_URL}/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const confirmToken = (userId: string, payload: any) => {
    return axios.patch(`${ENV.API_URL}/confirmations/${userId}`, payload);
};

export const updateLanguage = (userId: string, payload: any) => {
    return axios.patch(`${ENV.API_URL}/${ENV.API_VERSION}/users/${userId}`, payload);
};

export const resendConfirmToken = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/confirmations`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getUser = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/users/1`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};