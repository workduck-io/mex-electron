import React from 'react';
import Centered from '../Styled/Layouts';

export type DashboardProps = {
  title?: string;
};

const Dashboard: React.FC<DashboardProps> = () => {
  return <Centered>Dashboard</Centered>;
};

export default Dashboard;
