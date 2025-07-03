import * as React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import CustomSidebar from './CustomSidebar';

interface CoreLayoutProps extends LayoutProps {
  children: React.ReactNode;
}
export const CustomLayout: React.FC<CoreLayoutProps> = ({ children }) => (
  <Layout
    menu={CustomSidebar}
    sx={{ '& .MuiDrawer-root': { marginRight: '20px' } }}
  >
    {children}
  </Layout>
);
