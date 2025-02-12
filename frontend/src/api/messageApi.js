import axiosInstance from "../utils/axios.config.js";

const sendMessage = async (conversationId, messageData) => {
    return axiosInstance.post(`/message/send-text/${conversationId}`, messageData);
};

const deleteMessageForMe = async (messageId) => {
    return axiosInstance.put(`/message/delete-message-for-me/${messageId}`);
}

const updateMessage = async (messageId, messageData) => {
    return axiosInstance.put(`/message/update-message/${messageId}`, messageData);
}

const sendMediaMessage = async (conversationId, file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("media", file);
    return axiosInstance.post(`/message/send-media/${conversationId}`, formData);
}

const deleteMediaForMe = async (mediaId) => {
    return axiosInstance.put(`/message/delete-media-for-me/${mediaId}`);
}

const deleteMessageForEveryone = async (messageId) => {
    return axiosInstance.delete(`/message/delete-message-for-everyone/${messageId}`);
}

const deleteMediaForEveryone = async (messageId) => {
    return axiosInstance.delete(`/message/delete-media-for-everyone${messageId}`);
};

const getMessages = async (conversationId) => {
    return axiosInstance.get(`/message/get-messages/${conversationId}`);
}

export {
    sendMessage,
    deleteMessageForMe,
    updateMessage,
    sendMediaMessage,
    deleteMediaForMe,
    deleteMessageForEveryone,
    deleteMediaForEveryone,
    getMessages
}; 