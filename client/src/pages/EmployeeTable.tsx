import React, { Dispatch, useEffect } from 'react';
import { Table, Space, Button, Avatar, Modal } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Employee } from '../models/EmployeeModel';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmployees,
  deleteEmployee,
  selectEmployee,
  openDeleteModal,
  closeDeleteModal,
  openUpdateModal,
  closeUpdateModal,
  EmployeeTableState } from '../redux/features/employeesSlice'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const EmployeeTable: React.FC  = (): React.ReactElement => {
  const dispatch: Dispatch<any> = useDispatch();
  const {
    isLoading: loading,
    employees,
    salaryFilter,
    deleteModalVisible,
    updateModalVisible,
    selectedEmployee,
  } = useSelector((state: any) => state.employees) as EmployeeTableState;

  useEffect(() => {
    dispatch(getEmployees());
  }, [ dispatch ]);

  const columns: ColumnsType<Employee> = [
    {
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      width: 30,
      fixed: 'left',
      render: (_: any, { profile_pic }: Employee): React.ReactElement =>  <Avatar src={profile_pic}/>,
    },
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
      sorter: (a, b) => a._id - b._id
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: 'Login',
      dataIndex: 'login_id',
      key: 'login_id',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      filters: salaryFilter,
      onFilter: (value: any, record:Employee) => {
        const [floor, ceiling] = value.split(',')
        return record.salary >= parseInt(floor) && record.salary <= parseInt(ceiling);
      },
      sorter: (a, b) => a.salary - b.salary
    },
    {
      key: 'action',
      width: 100,
      render: (_: any, record: Employee): React.ReactElement  => (
        <Space size="middle">
          <Button 
            shape='circle'
            onClick={() => {
              dispatch(selectEmployee(record));
              dispatch(openDeleteModal());
            }}
            icon={<DeleteOutlined />}
          />
          <Button 
            type='primary'
            shape='circle'
            onClick={() => {
              dispatch(selectEmployee(record));
              dispatch(openUpdateModal());
            }}
            icon={<EditOutlined />}
          />
        </Space>
      )
    },
  ];

  return <>
    <Modal
      title="Are you sure you want to delete?"
      visible={deleteModalVisible}
      onOk={() => { dispatch(deleteEmployee(selectedEmployee?._id)) }}
      confirmLoading={loading}
      onCancel={() => { dispatch(closeDeleteModal()) }}
    >
      <p>Deleting {JSON.stringify(selectedEmployee?.full_name)}...</p>
    </Modal>

    <Modal
      title="Update"
      visible={updateModalVisible}
      onOk={() => {  }}
      confirmLoading={loading}
      onCancel={() => { dispatch(closeUpdateModal()) }}
    >
      <p></p>
    </Modal>
    <Table
    loading={loading}
      bordered={true}
      dataSource={employees}
      columns={columns}
      rowKey={'_id'}
    />
  </>
}


export default EmployeeTable;