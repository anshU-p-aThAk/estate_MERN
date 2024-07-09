import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js"


export const store = configureStore({
    reducer: { user: userReducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // to not get error from non-serializable values like functions, class instance.
        })

})