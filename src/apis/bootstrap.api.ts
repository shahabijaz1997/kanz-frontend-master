import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const getAllIndustries = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/industries`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getAllRegions = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/regions`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};

export const getCountries = (token: string) => {
    return axios.get(`${ENV.API_URL}/${ENV.API_VERSION}/countries`,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};