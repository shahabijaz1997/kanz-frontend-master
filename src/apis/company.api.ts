import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const postCompanyInformation = (payload: number, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/startups`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getCompanyInformation = (stepId: number, token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/startups/${stepId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};