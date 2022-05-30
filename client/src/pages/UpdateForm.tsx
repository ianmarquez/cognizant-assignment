import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Employee } from '../models/EmployeeModel';
import { updateEmployee, EmployeeTableState } from '../redux/features/employeesSlice';

const UpdateForm: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const {
    isLoading: loading,
    updateModalVisible,
    selectedEmployee,
  } = useSelector((state: any) => state.employees) as EmployeeTableState;
  
  const onFinish = (values: any) => {
    dispatch(updateEmployee(values as Employee))
    console.log(values);
  }

  return <>
    <Modal
      title="Update"
      visible={updateModalVisible}
      confirmLoading={loading}
      footer={null}
    >
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        initialValues={selectedEmployee as Store}
        onFinish={onFinish}
        autoComplete="off"
        layout='vertical'
      >
        <Form.Item
          label="Id"
          name="_id"
          rules={[{ required: true, message: 'Please input an Id!' }]}
        >
          <Input disabled/>
        </Form.Item>

        <Form.Item
          label="Name"
          name="full_name"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Login Id"
          name="login_id"
          rules={[{ required: true, message: 'Please input your Login Id!' }]}
        >
          <Input disabled/>
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: 'Please input your salary!' }]}
        >
          <InputNumber min={0}/>
        </Form.Item>

        <Form.Item
          label="Profile"
          name="profile_pic"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </>
}

export default UpdateForm;