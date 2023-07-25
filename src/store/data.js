import { createSlice } from "@reduxjs/toolkit";

export const Data = createSlice({
    name: "data",
    initialState: {
        data: {},
        tutor: {}
    },
    reducers: {
        getData: (state, action) => {
            if (action.payload.type === "tutor") {
                state.tutor = action.payload.data;
            } else {
                state.data = action.payload.data
            }
        }
    }
})

export const { getData } = Data.actions;

export default Data.reducer;