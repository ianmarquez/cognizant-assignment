import React from 'react';
import { Col, Layout, Row } from 'antd'
import Sidebar from './components/Sidebar';
import './styles/App.css';
import EmployeesTable from './pages/EmployeeTable';

const { Sider, Content } = Layout;

const App: React.FC = () => (
  <>
    <Layout style={{height:"100vh", textAlign: 'center'}}>
      <Layout>
        <Content>
          <Row>
            <Col span={24}>
              <EmployeesTable/>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  </>
)

export default App;
