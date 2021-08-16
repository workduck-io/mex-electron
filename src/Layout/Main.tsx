import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import styled, { useTheme } from 'styled-components';
import Graph from '../Components/Graph/Graph';
import { useGraphData } from '../Components/Graph/useGraphData';
import { Notifications } from '../Components/Notifications/Notifications';
import SideBar from '../Components/Sidebar';
import { navTooltip } from '../Components/Sidebar/Nav';
import { useInitialize } from '../Data/useInitialize';
import { useLocalData } from '../Data/useLocalData';
import { useSyncData } from '../Data/useSyncData';
import { useTreeFromLinks } from '../Editor/Store/DataStore';
import { useEditorStore } from '../Editor/Store/EditorStore';
import { getInitialNode } from '../Editor/Store/helpers';
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
  const history = useHistory();
  const loadNode = useEditorStore(state => state.loadNode);
  const id = useEditorStore(state => state.node.id);

  const showGraph = useEditorStore(state => state.showGraph);

  const { init } = useInitialize();

  const graphData = useGraphData();
  const localData = useLocalData();

  const setIpc = useSyncData();

  useEffect(() => {
    setIpc();
  }, [setIpc]);

  /** Initialization of the app details occur here */
  useEffect(() => {
    // console.log('Initializing', { sampleRCTree }); // eslint-disable-line no-console

    (async () => {
      localData
        .then(d => {
          // console.log('Data here', d);
          return d;
        })
        .then(d => init(d))
        .catch(e => console.error(e)); // eslint-disable-line no-console
    })();

    loadNode(getInitialNode());
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
      <Notifications />

      {showGraph && <Graph graphData={graphData} />}
    </AppWrapper>
  );
};

export default Main;
