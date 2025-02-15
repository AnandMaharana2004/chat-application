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
        }
    }
})

export const { setMessages, removeMessage } = messageSlice.actions
export default messageSlice.reducer