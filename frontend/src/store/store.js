// import { configureStore } from '@reduxjs/toolkit'
// import userReducers from '../redux/userSlices'

// const store = configureStore({
//     reducer: {
//         user: userReducers
//     }
// })

// export default store



import { configureStore } from "@reduxjs/toolkit";
import userReducers from "../redux/userSlices";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import messageSlice from "../redux/messageSlices";
import socketSlice from "../redux/socketSlices";

// Persist config
const persistConfig = {
  key: "user", // The key used in localStorage
  storage,
  whitelist: ["authUser"], // Persist only the `authUser` field in the `user` slice
};

// Wrap the user reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userReducers);

// Configure store
const store = configureStore({
  reducer: {
    user: persistedReducer, // Use persisted reducer
    messages: messageSlice,
    socket: socketSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable checks for non-serializable values in redux-persist
    }),
});

// Export persistor
export const persistor = persistStore(store);

export default store;
