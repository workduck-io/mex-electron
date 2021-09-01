import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import styled, { useTheme } from 'styled-components'
import { Notifications } from '../Components/Notifications/Notifications'
import SideBar from '../Components/Sidebar'
import { navTooltip } from '../Components/Sidebar/Nav'
import { useInitialize } from '../Data/useInitialize'
import { useLocalData } from '../Data/useLocalData'
import { useSyncData } from '../Data/useSyncData'
import { useTreeFromLinks } from '../Editor/Store/DataStore'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { getInitialNode } from '../Editor/Store/helpers'
import { GridWrapper } from '../Styled/Grid'
import { PixelToCSS } from '../Styled/helpers'
import InfoBar from './InfoBar'
import HelpTooltip from '../Components/Help/HelpTooltip'

const AppWrapper = styled.div`
  min-height: 100%;
  ${navTooltip};
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  grid-column-start: 2;
  /* margin-left: ${({ theme }) => PixelToCSS(theme.width.sidebar)}; */
  /* max-width: calc(100% - ${({ theme }) => PixelToCSS(theme.width.sidebar)}); */
  overflow: scroll;
`

export type MainProps = { children: React.ReactNode }

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  const theme = useTheme()
  const history = useHistory()
  const loadNode = useEditorStore((state) => state.loadNode)
  const id = useEditorStore((state) => state.node.id)
  const showGraph = useGraphStore((state) => state.showGraph)

  const { init } = useInitialize()

  const localData = useLocalData()

  const setIpc = useSyncData()

  useEffect(() => {
    setIpc()
  }, [setIpc])

  /** Initialization of the app details occur here */
  useEffect(() => {
    (async () => {
      localData
        .then((d) => {
          // console.log('Data here', d);
          return d
        })
        .then((d) => init(d))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()

    loadNode(getInitialNode())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Switch to the editor page whenever a new ID is loaded
    history.push('/editor')
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const Tree = useTreeFromLinks()

  return (
    <AppWrapper>
      <GridWrapper showGraph={showGraph}>
        <SideBar tree={Tree} starred={Tree} />
        <Content>{children}</Content>
        <InfoBar />
      </GridWrapper>
      <HelpTooltip />
      <ReactTooltip effect="solid" backgroundColor={theme.colors.gray[6]} arrowColor={theme.colors.gray[6]} />
      <Notifications />
    </AppWrapper>
  )
}

export default Main
