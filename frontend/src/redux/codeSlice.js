import { createSlice } from "@reduxjs/toolkit";

const codeSlice = createSlice({
    name: "code",
    initialState: {
        code: null
    },
    reducers: {
        setCode: (state, action) => {
            state.code = action.payload
        }
    }
})

export const {setCode} = codeSlice.actions
export default codeSlice.reducer