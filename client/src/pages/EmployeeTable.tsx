import React, { Dispatch, useEffect } from 'react';
import { Table, Space, Button, Avatar, Row, Col, Card, Tooltip, Pagination } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Employee } from '../models/EmployeeModel';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmployees,
  selectEmployee,
  openDeleteModal,
  openUpdateModal,
  EmployeeTableState,
  openUploadModal
} from '../redux/features/employeeTableSlice'
import { DeleteOutlined, EditOutlined, ExportOutlined, SyncOutlined } from '@ant-design/icons';
import DeleteModal from './DeleteModal';
import UpdateForm from './UpdateForm';
import UploadModal from './UploadModal';

const EmployeeTable: React.FC  = (): React.ReactElement => {
  const dispatch: Dispatch<any> = useDispatch();
  const {
    isLoading: loading,
    employees,
    salaryFilter,
  } = useSelector((state: any) => state.employees) as EmployeeTableState;

  useEffect(() => {
    dispatch(getEmployees());
  }, [ dispatch ]);

  const columns: ColumnsType<Employee> = [
    {
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      fixed: 'left',
      width: 40,
      render: (_: any, { profile_pic }: Employee): React.ReactElement =>  <Avatar src={profile_pic}/>,
    },
    {
      title: 'Id',
      dataIndex: '_id',
      fixed: 'left',
      width: 50,
      key: '_id',
      sorter: (a, b) => a._id.localeCompare(b._id)
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 300,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: 'Login',
      dataIndex: 'login_id',
      key: 'login_id',
      width: 300,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name)
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: 150,
      filters: salaryFilter,
      onFilter: (value: any, record:Employee) => {
        const [floor, ceiling] = value.split(',')
        return record.salary >= parseInt(floor) && record.salary <= parseInt(ceiling);
      },
      sorter: (a, b) => a.salary - b.salary
    },
    {
      key: 'action',
      width: 70,
      render: (_: any, record: Employee): React.ReactElement  => (
        <Space size="middle">
          <Tooltip title="Delete">
            <Button 
              shape='circle'
              onClick={() => {
                dispatch(selectEmployee(record));
                dispatch(openDeleteModal());
              }}
              icon={<DeleteOutlined />}
              danger
              type="primary"
            />
          </Tooltip>
          <Tooltip title="Update">
            <Button 
              type='primary'
              shape='circle'
              onClick={() => {
                dispatch(selectEmployee(record));
                dispatch(openUpdateModal());
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
        </Space>
      )
    },
  ];

  return <Card
    style={{margin: '10px', textAlign: 'left'}}
    title={<Row>
      <Col span={12}><h1>Employees</h1></Col>
      <Col span={12}>
        <Space size={'middle'} style={{ float: 'right' }}>
          <Tooltip title="Export">
            <Button type='primary' shape='circle' icon={<ExportOutlined />} onClick={() => dispatch(openUploadModal())}/>
          </Tooltip>
          <Tooltip title="Refresh">
            <Button type='primary' shape='circle' icon={<SyncOutlined />} onClick={() => dispatch(getEmployees())}/>
          </Tooltip>
        </Space>
      </Col>
    </Row>}
  >
    <Row>
      <Col span={24}>
        <Table
          loading={loading}
          bordered={true}
          dataSource={employees}
          columns={columns}
          rowKey={'_id'}
          scroll={{ x: 1500 }}
          pagination={{ position: ['bottomRight'] }}
        />
      </Col>
    </Row>
    <UploadModal />
    <DeleteModal />
    <UpdateForm />
  </Card>
}


export default EmployeeTable;