import React from 'react';
import { Layout } from 'antd'
import Sidebar from './components/Sidebar';
import './styles/App.css';

const { Sider, Content } = Layout;

const App: React.FC = () => (
  <>
    <Layout style={{height:"100vh", textAlign: 'center'}}>
      <Sider>
        <Sidebar/>
      </Sider>
      <Layout>
        <Content>
          this is the content
        </Content>
      </Layout>
    </Layout>
  </>
)

export default App;
