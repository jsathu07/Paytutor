import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import data from './data';
import trans from './trans';
import student from './student';

export default configureStore({
    reducer: {
        user,
        data,
        trans,
        student
    }
})