import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import styled, { useTheme } from 'styled-components';
import SideBar from '../Components/Sidebar';
import { navTooltip } from '../Components/Sidebar/Nav';
import sampleRCTree from '../Components/Sidebar/sampleRCTreeData';
import { getInitialEditorState, useEditorContext } from '../Context/Editor';
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
  const theme = useTheme();
  const edCtx = useEditorContext();
  /** Initialization of the app details occur here
   * It is located in main as all the contexts are initialized
   */
  useEffect(() => {
    console.log('Initializing'); // eslint-disable-line no-console

    edCtx?.loadNode(getInitialEditorState().node);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppWrapper>
      <ReactTooltip
        effect="solid"
        backgroundColor={theme.colors.gray.s5}
        arrowColor={theme.colors.gray.s5}
      />
      <SideBar tree={sampleRCTree} starred={sampleRCTree} />
      <Content>{children}</Content>
    </AppWrapper>
  );
};

export default Main;
