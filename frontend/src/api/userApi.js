import axiosInstance from "../utils/axios.config.js";

const updateUserProfile = async (file) => {
    const formData = new FormData();
    formData.append("profilepicture", file);
    return axiosInstance.post(`/user/update-profile-pic`, formData);
};

const updateBio = async (data) => {
    return axiosInstance.put(`/user/update-bio`, data);
}

const updateAbout = async (data) => {
    return axiosInstance.put(`/user/update-about`, data);
}

const addToFriend = async (id) => {
    return axiosInstance.put(`/user/add-to-friend/${id}`);
}
const addToFavorate = async (id) => {
    return axiosInstance.put(`/user/add-to-favorate/${id}`);
}

const addToBlock = async (id) => {
    return axiosInstance.put(`/user/add-to-block/${id}`);
}

const removeFormFavorate = async (id) => {
    return axiosInstance.put(`/user/remove-from-favorate/${id}`);
}

const removeFormFriend = async (id) => {
    return axiosInstance.put(`/user/remove-from-friend/${id}`);
}

const removeFormBlock = async (id) => {
    return axiosInstance.put(`/user/remove-from-block/${id}`);
}

const getFriendList = async () => {
    return axiosInstance.get(`/user/friend-list`);
}

const getFavorateList = async () => {
    return axiosInstance.get(`/user/favorate-list`);
}

const getBlockList = async () => {
    return axiosInstance.get(`/user/block-list`);
}

const getProfile = async (id) => {
    return axiosInstance.get(`/user/profile/${id}`);
}

const explore = async () => {
    return axiosInstance.get(`/user/getotherusers`)
}

export {
    explore,
    updateUserProfile,
    updateBio,
    updateAbout,
    addToFriend,
    addToFavorate,
    addToBlock,
    removeFormFavorate,
    removeFormFriend,
    removeFormBlock,
    getFriendList,
    getFavorateList,
    getBlockList,
    getProfile
};