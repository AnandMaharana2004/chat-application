import axiosInstance from "../utils/axios.config.js";

const codeSend = async (id,code) => {
    return axiosInstance.post(`/ai/code-send/${id}`,code);
}

export {codeSend}