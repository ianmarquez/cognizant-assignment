import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from './features/employeesSlice';

export default configureStore({
  reducer: {
    employees: employeesReducer
  },
});
