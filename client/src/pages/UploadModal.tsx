import React, { Dispatch, useState } from 'react';
import { Button, Modal, Upload, UploadProps, Alert, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeUploadModal,
  EmployeeTableState,
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
    updateErrorMessage('');
  }

  const props: UploadProps = {
    action: 'http://localhost:3001/v1/api/employees/upload',
    beforeUpload: file => {
      let errorMessage = '';
      const isCSV = file.type === 'text/csv';
      const is2MB = file.size / 1024 / 1024 < 2
      if (!isCSV) {
        errorMessage = 'File type is not supported';
      }
      if (!is2MB) {
        errorMessage = 'File size must be 2MB below';
      }
      updateErrorMessage(errorMessage);
      return isCSV || is2MB || Upload.LIST_IGNORE;
    },
    onChange: info => {
      console.log(info.fileList);
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
    onCancel={onModalClose}
  >
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
    
  </Modal>
}

export default UploadModal;
