import { createSlice } from "@reduxjs/toolkit";

export const Student = createSlice({
    name: "student",
    initialState: {
        data: {},
    },
    reducers: {
        getStudent: (state, action) => { state.data = action.payload }
    }
})

export const { getStudent } = Student.actions;

export default Student.reducer;