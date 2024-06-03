import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const postSyndicateInformation = (payload: number, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/syndicates`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getSyndicateInformation = (stepId: number, token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/syndicates/${stepId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};