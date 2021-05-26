import React from 'react';
import styled from 'styled-components';
import Nav from '../Components/Nav';
import links from '../Conf/links';

const AppWrapper = styled.div`
  display: flex;
  min-height: 100%;
`;
const Content = styled.div`
  flex-grow: 1;
  margin-left: ${({ theme }) => theme.width.nav};
  max-width: calc(100% - ${({ theme }) => theme.width.nav});
  overflow-x: hidden;
`;

export type MainProps = { children: React.ReactNode };

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  return (
    <AppWrapper>
      <Nav links={links} />
      <Content>{children}</Content>
    </AppWrapper>
  );
};

export default Main;
