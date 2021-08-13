import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import styled, { useTheme } from 'styled-components';
import SideBar from '../Components/Sidebar';
import { navTooltip } from '../Components/Sidebar/Nav';
import sampleRCTree, { sampleFlatTree } from '../Components/Sidebar/sampleRCTreeData';
import { getInitialNode } from '../Editor/Store/helpers';
import { useEditorStore } from '../Editor/Store/EditorStore';
import { PixelToCSS } from '../Styled/helpers';
import useDataStore, { useTreeFromLinks } from '../Editor/Store/DataStore';
import { generateComboTexts } from '../Editor/Store/sampleTags';
import Graph from '../Components/Graph/Graph';
import { useGraphData } from '../Components/Graph/useGraphData';
import { useLocalData } from '../Data/useLocalData';

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
  const loadNode = useEditorStore(state => state.loadNode);
  const id = useEditorStore(state => state.node.id);

  const showGraph = useEditorStore(state => state.showGraph);
  const initializeData = useDataStore(state => state.initializeData);

  const graphData = useGraphData();
  const localData = useLocalData();

  /** Initialization of the app details occur here */
  useEffect(() => {
    console.log('Initializing', { sampleRCTree }); // eslint-disable-line no-console

    (async () => {
      localData
        .then(d => {
          console.log('Data here', d);
          return d;
        })
        .catch(e => console.error(e));
    })();

    loadNode(getInitialNode());

    initializeData(
      // Tags
      [],
      // Ilinks
      generateComboTexts(sampleFlatTree),
      // combotexts
      generateComboTexts(['webem', 'sync'])
      // Need to add content here as well
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Switch to the editor page whenever a new ID is loaded
    history.push('/editor');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const Tree = useTreeFromLinks();

  return (
    <AppWrapper>
      <ReactTooltip effect="solid" backgroundColor={theme.colors.gray.s5} arrowColor={theme.colors.gray.s5} />
      <SideBar tree={Tree} starred={Tree} />
      <Content>{children}</Content>

      {showGraph && <Graph graphData={graphData} />}
    </AppWrapper>
  );
};

export default Main;
