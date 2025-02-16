import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
    name: "messages",
    initialState: {
        message: null
    },
    reducers: {
        setMessages: (state, action) => {
            state.message = action.payload
        },
        removeMessage: (state, action) => {
            state.message = state.message.filter((message) => message._id !== action.payload._id);
        },
        replaceMessage: (state, action) => {
            // Find the message by ID and replace its content and mark it as deleted for everyone.
            state.message = state.message.map((mes) => {
                if (mes._id === action.payload._id) {
                    return {
                        ...mes,
                        content: action.payload.content,
                        isDeletedForEveryone: action.payload.isDeletedForEveryone,
                    };
                }
                return mes;
            });
        }
    }
})

export const { setMessages, removeMessage, replaceMessage } = messageSlice.actions
export default messageSlice.reducer