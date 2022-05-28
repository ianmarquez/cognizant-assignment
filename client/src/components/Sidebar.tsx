import React from 'react';
import { Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import '../styles/Sidebar.css';

const menuItems: Array<ItemType> = [
  { label: 'Function 1', key: 'function-1' },
  { label: 'Function 2', key: 'function-2' },
  { label: 'Function 3', key: 'function-3' },
  { label: 'Function 4', key: 'function-4' },
  { label: 'Function 5', key: 'function-5' }
]

const sidebar: React.FC = () => (
  <>
    <Avatar size={150} style={{ marginTop: '30px' }} icon={<UserOutlined/>}/>
    <div className="username"> Long User Name </div>
    <Menu
      style={{ marginTop: '30px' }}
      items={menuItems}
      theme='dark'
      mode='inline'
    />
  </>
)


export default sidebar;