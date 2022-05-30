import { Modal } from 'antd';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteEmployee,
  closeDeleteModal,
  EmployeeTableState,
} from '../redux/features/employeesSlice'

const DeleteModal: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const {
    isLoading: loading,
    deleteModalVisible,
    selectedEmployee,
  } = useSelector((state: any) => state.employees) as EmployeeTableState;

  
  return <Modal
  visible={deleteModalVisible}
  onOk={() => { dispatch(deleteEmployee(selectedEmployee?._id)) }}
  confirmLoading={loading}
  onCancel={() => { dispatch(closeDeleteModal()) }}
>
  <h2>Are you sure you want to delete {JSON.stringify(selectedEmployee?.full_name)}?</h2>
</Modal>
}

export default DeleteModal;