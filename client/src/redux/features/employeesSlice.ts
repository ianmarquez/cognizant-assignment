import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { Employee } from '../../models/EmployeeModel';

type SalaryFilter = {
  text: string;
  value: string
}

export interface EmployeeState {
  employees: Employee[],
  isLoading: boolean,
  isErrorState: boolean,
  message: string,
  selectedEmployee: Employee | null,
  salaryFilter: SalaryFilter[],
}

export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (arg, { rejectWithValue }) => {
    try {
      const response: AxiosResponse = await axios.get('http://localhost:3001/v1/api/employees');
      const { data } = response.data;
      return data;
    } catch (err) {
      rejectWithValue(err)
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      const response: AxiosResponse = await axios.delete(`http://localhost:3001/v1/api/employee/${id}`);
      const { data } = response.data;
      return data;
    } catch (err) {
      rejectWithValue(err)
    }
  },
);

export const createEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (body: Employee, { rejectWithValue }) => {
    try {
      const response: AxiosResponse = await axios.post(`http://localhost:3001/v1/api/employee`);
      const { data } = response.data;
      return data;
    } catch (err) {
      rejectWithValue(err)
    }
  },
);

const createSalaryFilters = (salaries: Array<number>): SalaryFilter[] => {
  const salaryArr = salaries.sort();
  const INCREMENT = 500;
  const floor = Math.round(salaryArr[0]/1000)*1000;
  const ceiling = Math.round(salaryArr[salaryArr.length - 1]/1000)*1000;
  console.log(floor, ceiling);
  let current = floor;
  const filters: SalaryFilter[] = []
  while (current < ceiling) {
    filters.push({
      text: `${current} - ${current + INCREMENT}`,
      value: `${current},${current + INCREMENT}`
    });
    current = current + INCREMENT;
  }
  return filters;
}

const employeeTableSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    isLoading: false,
    isErrorState: false,
    message: '',
    selectedEmployee: null,
    salaryFilter: [],
  },
  reducers: {},
  extraReducers: {
    [getEmployees.pending.toString()]: (state: EmployeeState) => {
      state.isLoading = true
    },
    [getEmployees.fulfilled.toString()]: (state: EmployeeState, action: any) => {
      state.employees = action.payload;
      state.isLoading = false;
      state.isErrorState = false;
      state.message = '';
      if(action.payload && action.payload.length > 0) {
        const salaries = action.payload.map((employee: Employee) => employee.salary);
        state.salaryFilter = createSalaryFilters(salaries.sort());
      }
    },
    [getEmployees.rejected.toString()]: (state: EmployeeState, action: any) => {
      state.isLoading = false;
      state.isErrorState = true;
      state.message = action.payload.message;
    },
    [deleteEmployee.pending.toString()]: (state: EmployeeState) => {
      state.isLoading = true
    },
    [deleteEmployee.fulfilled.toString()]: (state: EmployeeState, action: any) => {
      const { _id } = action.payload;
      state.isLoading = false;
      state.employees = state.employees.filter((employee: Employee) => employee._id !== _id);
    },
    [deleteEmployee.rejected.toString()]: (state: EmployeeState, action: any) => {
      state.isLoading = false;
      state.isErrorState = true;
      state.message = action.payload.message;
    }
  }
});

export default employeeTableSlice.reducer;