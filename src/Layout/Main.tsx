import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import styled, { useTheme } from 'styled-components';
import SideBar from '../Components/Sidebar';
import { navTooltip } from '../Components/Sidebar/Nav';
import sampleRCTree, {
  sampleFlatTree,
} from '../Components/Sidebar/sampleRCTreeData';
import { getInitialNode } from '../Editor/Store/helpers';
import { useEditorStore } from '../Editor/Store/EditorStore';
import { PixelToCSS } from '../Styled/helpers';
import useDataStore, { useTreeFromLinks } from '../Editor/Store/DataStore';
import defaultTags, { generateComboTexts } from '../Conf/sampleTags';
import { generateILinks } from '../Conf/sampleILinks';

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
  const history = useHistory();
  const loadNode = useEditorStore((state) => state.loadNode);
  const id = useEditorStore((state) => state.node.id);

  const initializeData = useDataStore((state) => state.initializeData);

  /** Initialization of the app details occur here */
  useEffect(() => {
    console.log('Initializing', { sampleRCTree }); // eslint-disable-line no-console

    loadNode(getInitialNode());

    initializeData(
      defaultTags,
      generateILinks(sampleFlatTree),
      generateComboTexts(['webem'])
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Switch to the editor page whenever a new ID is loaded
    history.push('/editor');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const Tree = useTreeFromLinks();

  return (
    <AppWrapper>
      <ReactTooltip
        effect="solid"
        backgroundColor={theme.colors.gray.s5}
        arrowColor={theme.colors.gray.s5}
      />
      <SideBar tree={Tree} starred={Tree} />
      <Content>{children}</Content>
    </AppWrapper>
  );
};

export default Main;
