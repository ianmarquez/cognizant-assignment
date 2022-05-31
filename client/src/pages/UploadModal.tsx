import React, { Dispatch, useState } from 'react';
import { Button, Modal, Upload, UploadProps, Alert, Row, Col, Spin, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeUploadModal,
  EmployeeTableState,
  getEmployees,
  startLoading,
  stopLoading,
} from '../redux/features/employeeTableSlice'
import { UploadOutlined } from '@ant-design/icons';

const UploadModal: React.FC = () => {
  const [ errorMessage, updateErrorMessage ] = useState('');
  const dispatch: Dispatch<any> = useDispatch();
  const {
    isLoading: loading,
    uploadModalVisible,
  } = useSelector((state: any) => state.employees) as EmployeeTableState;

  const onModalClose = () => {
    dispatch(closeUploadModal());
    dispatch(getEmployees());
    updateErrorMessage('');
  }

  const props: UploadProps = {
    accept: '.csv',
    action: 'http://localhost:3001/v1/api/employees/upload',
    maxCount: 1,
    onRemove: () => {
      updateErrorMessage('');
    },
    beforeUpload: file => {
      dispatch(startLoading());
      let errorMessage = '';
      const is2MB = file.size / 1024 / 1024 < 2
      if (!is2MB) errorMessage = 'File size must be 2MB below';
      updateErrorMessage(errorMessage);
      dispatch(stopLoading());
      return is2MB || Upload.LIST_IGNORE;
    },
    onChange: info => {
      let hasError = false;
      if (info.fileList) {
        info.fileList.forEach((file) => {
          if (file?.status === 'error') {
            hasError = true;
            updateErrorMessage(file.response?.message);
          }
        });
      }
      if (!hasError && info.fileList.length > 0) {
        message.success('Employee Upload Successful!');
      }
    },
  }

  const renderErrorMessage = (): React.ReactElement | null => {
    if (!errorMessage) return null;
    return <Alert message="Error" type="error" description={errorMessage} showIcon/>
  }

  return <Modal
    title='Import Users'
    visible={uploadModalVisible}
    confirmLoading={loading}
    onOk={onModalClose}
    onCancel={onModalClose}
  >
    <Spin tip="Validating" spinning={ loading }>
      <Row>
        <Col span={24}>
          <Upload {...props}>
            <Row>
              <Col span={24}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Col>
            </Row>
          </Upload>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          {renderErrorMessage()}
        </Col>
      </Row>
    </Spin>
  </Modal>
}

export default UploadModal;
