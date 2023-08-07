import { createSlice } from "@reduxjs/toolkit";

export const Transactions = createSlice({
    name: "transactions",
    initialState: {
        data: []
    },
    reducers: {
        getTransactions: (state, action) => { state.data = action.payload }
    }
})

export const { getTransactions } = Transactions.actions;

export default Transactions.reducer;