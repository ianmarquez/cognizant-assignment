import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Avatar } from 'antd';
import axios, { AxiosResponse } from 'axios';
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  id: number;
  full_name: string;
  login_id: string;
  salary: number;
  profile_pic: string;
}

const columns: ColumnsType<DataType> =[
  {
    dataIndex: 'profile_pic',
    key: 'profile_pic',
    width: 30,
    fixed: 'left',
    render: (_: any, { profile_pic }: DataType): React.ReactElement =>  <Avatar src={profile_pic}/>,
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'Login',
    dataIndex: 'login_id',
    key: 'login_id',
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    key: 'salary',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, record: DataType) => (
      <Space size="middle">
        <Button>Delete</Button>
      </Space>
    )
  },
]

const Employees: React.FC = () => {
  const [ data, updateData ] = useState<DataType[]>([]);
  const [ isLoading, updateLoading ] = useState(true);
  
  async function fetchEmployees() {
    let employees: DataType[] = [];
    try {
      const response: AxiosResponse = await axios.get('https://nphc-hr.free.beeceptor.com/employees');
      const { data } = response;
      employees = [...employees, ...data];
    } catch (err) {
      employees = [];
      console.log(err);
    }
    updateData(employees);
    return updateLoading(false);
  }

  useEffect(()=> {
    if (data)
    fetchEmployees();
  }, []);

  return <Table
    loading={isLoading}
    bordered={true}
    dataSource={data}
    columns={columns}
  />
}

export default Employees;