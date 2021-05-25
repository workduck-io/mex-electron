import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  font-size: 1.5rem;
  padding: ${({ theme }) => theme.spacing.medium};
`;

export type DashboardProps = { files: number };

const Dashboard: React.FC<DashboardProps> = ({ files }: DashboardProps) => {
  return <StyledDiv>Total files: {files}</StyledDiv>;
};

export default Dashboard;
