import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const postRealtorInformation = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/realtors`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getRealtorInformation = (stepId: number, token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/realtors/${stepId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};