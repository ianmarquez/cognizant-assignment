import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from './features/employeeTableSlice';

export default configureStore({
  reducer: {
    employees: employeesReducer
  },
});
