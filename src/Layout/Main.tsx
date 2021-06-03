import React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import SideBar from '../Components/Sidebar';
import { navTooltip } from '../Components/Sidebar/Nav';
import sampleRCTree from '../Components/Sidebar/sampleRCTreeData';
import { PixelToCSS } from '../Styled/helpers';

const AppWrapper = styled.div`
  display: flex;
  min-height: 100%;
  ${navTooltip};
`;
const Content = styled.div`
  display: flex;
  flex-grow: 1;
  margin-left: ${({ theme }) => PixelToCSS(theme.width.sidebar)};
  max-width: calc(100% - ${({ theme }) => PixelToCSS(theme.width.sidebar)});
  overflow-x: hidden;
`;

export type MainProps = { children: React.ReactNode };

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  return (
    <AppWrapper>
      <ReactTooltip effect="solid" />
      <SideBar tree={sampleRCTree} starred={sampleRCTree} />
      <Content>{children}</Content>
    </AppWrapper>
  );
};

export default Main;
