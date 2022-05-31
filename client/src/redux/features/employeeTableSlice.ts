import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { Employee } from '../../models/EmployeeModel';

type SalaryFilter = {
  text: string;
  value: string;
}

export interface EmployeeTableState {
  employees: Employee[];
  isLoading: boolean;
  isErrorState: boolean;
  message: string;
  selectedEmployee: Employee | null;
  salaryFilter: SalaryFilter[];
  deleteModalVisible: boolean;
  updateModalVisible: boolean;
  uploadModalVisible: boolean;
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
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      const response: AxiosResponse = await axios.delete(`http://localhost:3001/v1/api/employee/${id}`);
      const { data } = response.data;
      return data;
    } catch (err) {
      rejectWithValue(err)
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (body: Employee, { rejectWithValue }) => {
    try {
      const { _id } = body;
      const response: AxiosResponse = await axios.put(`http://localhost:3001/v1/api/employee/${_id}`, body);
      return { ...response.data, ...body };
    } catch (err) {
      rejectWithValue(err)
    }
  },
);

const createSalaryFilters = (salaries: Array<number>): SalaryFilter[] => {
  const salaryArr = salaries.sort((a,b) => a - b);
  const INCREMENT = 500;
  const floor = Math.round(salaryArr[0]/1000)*1000;
  const ceiling = Math.round(salaryArr[salaryArr.length - 1]/1000)*1000;
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
    deleteModalVisible: false,
    updateModalVisible: false,
    uploadModalVisible: false,
  },
  reducers: {
    selectEmployee(state, action: any) {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
    },
    openDeleteModal(state) {
      state.deleteModalVisible = true;
    },
    closeDeleteModal(state) {
      state.deleteModalVisible = false;
    },
    openUpdateModal(state) {
      state.updateModalVisible = true;
    },
    closeUpdateModal(state) {
      state.updateModalVisible = false;
    },
    openUploadModal(state) {
      state.uploadModalVisible = true;
    },
    closeUploadModal(state) {
      state.uploadModalVisible = false;
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    }
  },
  extraReducers: {
    [getEmployees.pending.toString()]: (state: EmployeeTableState) => {
      state.isLoading = true
      state.message = '';
    },
    [getEmployees.fulfilled.toString()]: (state: EmployeeTableState, action: any) => {
      state.employees = action.payload;
      state.isLoading = false;
      state.isErrorState = false;
      state.message = '';
      if(action.payload && action.payload.length > 0) {
        const salaries = action.payload.map((employee: Employee) => employee.salary);
        state.salaryFilter = createSalaryFilters(salaries.sort());
      }
    },
    [getEmployees.rejected.toString()]: (state: EmployeeTableState, action: any) => {
      state.isLoading = false;
      state.isErrorState = true;
      state.message = action.payload.message;
    },
    [deleteEmployee.pending.toString()]: (state: EmployeeTableState) => {
      state.isLoading = true
      state.message = '';
    },
    [deleteEmployee.fulfilled.toString()]: (state: EmployeeTableState, action: any) => {
      const { _id } = action.payload;
      state.isLoading = false;
      state.selectedEmployee = null;
      state.employees = state.employees.filter((employee: Employee) => employee._id !== _id);
      state.deleteModalVisible = false;
    },
    [deleteEmployee.rejected.toString()]: (state: EmployeeTableState, action: any) => {
      state.isLoading = false;
      state.isErrorState = true;
      state.message = action.payload.message;
    },
    [updateEmployee.pending.toString()]: (state: EmployeeTableState) => {
      state.isLoading = true
      state.message = '';
    },
    [updateEmployee.fulfilled.toString()]: (state: EmployeeTableState, action: any) => {
      const { _id } = action.payload;
      state.isLoading = false;
      state.selectedEmployee = null;
      const updatedEmployees: Employee[] = [];
      state.employees.forEach((employee: Employee) => {
        if(employee._id === _id) {
          employee = { ...employee,  ...action.payload }
        }
        updatedEmployees.push(employee);
      })
      state.employees = updatedEmployees
      state.updateModalVisible = false;
    },
    [updateEmployee.rejected.toString()]: (state: EmployeeTableState, action: any) => {
      state.isLoading = false;
      state.isErrorState = true;
      state.message = action.payload.message;
    }
  }
});
export const {
  selectEmployee,
  clearSelectedEmployee,
  openDeleteModal,
  closeDeleteModal,
  openUpdateModal,
  closeUpdateModal,
  closeUploadModal,
  openUploadModal,
  startLoading,
  stopLoading,
} = employeeTableSlice.actions
export default employeeTableSlice.reducer;