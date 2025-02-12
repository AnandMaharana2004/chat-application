import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
    name : "messages",
    initialState : {
        message : null
    },
    reducers : {
        setMessages : (state, action) => {
            state.message = action.payload
        }
    }
})

export const {setMessages} = messageSlice.actions
export default messageSlice.reducer