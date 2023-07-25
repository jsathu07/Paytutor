import { createSlice } from "@reduxjs/toolkit";

export const User = createSlice({
    name: "user",
    initialState: {
        data:{}
    },
    reducers: {
        getUser: (state, action) => { state.data = action.payload }
    }
})

export const { getUser } = User.actions;

export default User.reducer;