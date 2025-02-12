import axiosInstance from "../utils/axios.config";

const login = async (loginData) => {
    return axiosInstance.post("/auth/login", loginData);
}

const register = async (registerData) => {
    return axiosInstance.post("/auth/register", registerData);
}

const resetPassword = async (data) => {
    return axiosInstance.put("/auth/reset-password", data);
}

const forgotPassword = async (data) => {
    return axiosInstance.post("/auth/forgot-password", data);
}

const resetAccessToken = async (data) => {
    return axiosInstance.post("/auth/reset-access-token", data);
}

const logout = async () => {
    return axiosInstance.get("/auth/logout");
}

export {
    login,
    register,
    resetPassword,
    forgotPassword,
    resetAccessToken,
    logout
};