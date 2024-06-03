import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const getRoleBasedAttachments = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/settings/attachments`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getAttachments = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/attachments`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const uploadAttachments = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/attachments`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const removeAttachment = (id: any, token: string) => {
    return axios.delete(`${ENV.API_URL}/${ENV.API_VERSION}/attachments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const submitData = (token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/attachments/submit`,{}, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};