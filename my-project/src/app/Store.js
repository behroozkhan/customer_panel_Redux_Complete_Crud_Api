import { configureStore } from "@reduxjs/toolkit";
import TodoReducers  from "../features/customer/CustomerSlice";

export const store = configureStore({
    reducer: TodoReducers
});