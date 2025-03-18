import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: null,
        onlineUsers: null,
        selectedUser: null,
        searchUsers: null,
        userBlockList: null,
        userFavorateList: null,
        userFriendList: null,
        profile: null,
        showImage : null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setSelectedUsers: (state, action) => {
            state.selectedUser = action.payload
        },
        setUserBlockList: (state, action) => {
            state.userBlockList = action.payload
        },
        setUserFavorateList: (state, action) => {
            const favoriteList = state.authUser.favoriteList;

            if (favoriteList.includes(action.payload)) {
                // Remove the ID if it already exists in the favorite list
                state.authUser.favoriteList = favoriteList.filter((id) => id !== action.payload);
            } else {
                // Add the ID to the favorite list if it doesn't exist
                state.authUser.favoriteList = [...favoriteList, action.payload];
            }
        },
        setUserFriendList: (state, action) => {
            state.userFriendList = action.payload
        },
        setProfile: (state, action) => {
            state.profile = action.payload
        },
        setAuthUser_ProfilePicture: (state, action) => {
            state.authUser.profilePicture = action.payload
        },
        setShowImage : (state, action) => {
            state.showImage = action.payload
        }
    }
})
export const {
    setAuthUser,
    setOnlineUsers,
    setOtherUsers,
    setSelectedUsers,
    setUserBlockList,
    setUserFavorateList,
    setSearchUsers,
    setUserFriendList,
    setProfile,
    setAuthUser_ProfilePicture,
    setShowImage
} = userSlice.actions
export default userSlice.reducer;

// log userSlice, reducers so that red redux in details