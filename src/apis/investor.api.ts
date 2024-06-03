import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const selectInvestorType = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/investor/type`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const investmentAccridiation = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/${ENV.API_VERSION}/investor/accreditation`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getInvestor = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/investor`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};