import axiosInstance from "../utils/axios.config.js";

const analyseCode = async (prompt) => {
    return axiosInstance.post(`/ai/analyse-code`,{prompt : prompt});
}

export {analyseCode}