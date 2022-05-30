import React from 'react';
import { Layout } from 'antd'
import Sidebar from './components/Sidebar';
import './styles/App.css';
import EmployeesTable from './pages/EmployeeTable';

const { Sider, Content } = Layout;

const App: React.FC = () => (
  <>
    <Layout style={{height:"100vh", textAlign: 'center'}}>
      <Sider>
        <Sidebar/>
      </Sider>
      <Layout>
        <Content>
          <EmployeesTable/>
        </Content>
      </Layout>
    </Layout>
  </>
)

export default App;
