import { ipcRenderer } from 'electron'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled, { useTheme } from 'styled-components'
import tinykeys from 'tinykeys'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { useHelpStore } from '../Components/Help/HelpModal'
import HelpTooltip from '../Components/Help/HelpTooltip'
import { Notifications } from '../Components/Notifications/Notifications'
import Nav, { navTooltip } from '../Components/Sidebar/Nav'
import links from '../Conf/links'
import { useInitialize } from '../Data/useInitialize'
import { useLocalData } from '../Data/useLocalData'
import { useSyncData } from '../Data/useSyncData'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { useRecentsStore } from '../Editor/Store/RecentsStore'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { IpcAction } from '../Spotlight/utils/constants'
import { useSaveAndExit } from '../Spotlight/utils/hooks'
import { GridWrapper } from '../Styled/Grid'

const AppWrapper = styled.div`
  min-height: 100%;
  ${navTooltip};
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  grid-column-start: 2;
  overflow: scroll;
`

export type MainProps = { children: React.ReactNode }

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  const theme = useTheme()
  const history = useHistory()
  const nodeId = useEditorStore((state) => state.node.id)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))

  const { move, push } = useNavigation()

  const { init } = useInitialize()

  useSaveAndExit()

  const { getLocalData } = useLocalData()

  useEffect(() => {
    ipcRenderer.on(IpcAction.OPEN_NODE, (_event, { nodeId }) => {
      push(nodeId)
    })
    ipcRenderer.on(IpcAction.CLEAR_RECENTS, () => {
      clear()
    })
    ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
      const { data } = arg
      addRecent(data)
    })
  }, [])

  const { setIpc } = useSyncData()

  useEffect(() => {
    setIpc()
  }, [])

  /** Initialization of the app details occur here */
  useEffect(() => {
    (async () => {
      getLocalData()
        .then((d) => {
          // console.log('Data here', d);
          return d
        })
        .then((d) => init(d))
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()

    push('@')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Switch to the editor page whenever a new ID is loaded
    history.push('/editor')
  }, [nodeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.gotoBackwards.keystrokes]: (event) => {
        event.preventDefault()
        move(-1)
      },
      [shortcuts.gotoForward.keystrokes]: (event) => {
        event.preventDefault()
        move(+1)
      },
      [shortcuts.showSnippets.keystrokes]: (event) => {
        event.preventDefault()
        history.push('/snippets')
      },
      [shortcuts.showIntegrations.keystrokes]: (event) => {
        event.preventDefault()
        history.push('/integrations')
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        event.preventDefault()
        history.push('/editor')
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        event.preventDefault()
        history.push('/settings')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <AppWrapper>
      <GridWrapper>
        <Nav links={links} />
        <Content>{children}</Content>
      </GridWrapper>
      <HelpTooltip />
      <ReactTooltip effect="solid" backgroundColor={theme.colors.gray[6]} arrowColor={theme.colors.gray[6]} />
      <Notifications />
    </AppWrapper>
  )
}

export default Main
