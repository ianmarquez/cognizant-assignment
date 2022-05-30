import React, { Dispatch, useEffect } from 'react';
import { Table, Space, Button, Avatar } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Employee } from '../models/EmployeeModel';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, deleteEmployee } from '../redux/features/employeesSlice'

const EmployeeTable: React.FC  = (): React.ReactElement => {
  const dispatch: Dispatch<any> = useDispatch();
  const { isLoading: loading, employees, salaryFilter } = useSelector((state: any) => state.employees);

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
      title: 'Action',
      key: 'action',
      render: (_: any, record: Employee): React.ReactElement  => (
        <Space size="middle">
          <Button onClick={() => {
            dispatch(deleteEmployee(record._id));
          }}>Delete</Button>
        </Space>
      )
    },
  ];

  return <>
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