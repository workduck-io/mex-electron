import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import SyncBlockInfo from '../../editor/Components/SyncBlock/SyncBlockInfo'
import { useGraphData } from '../../hooks/useGraphData'
import useLayout from '../../hooks/useLayout'
import { useKeyListener } from '../../hooks/useShortcutListener'
import useToggleElements from '../../hooks/useToggleElements'
import { useHelpStore } from '../../store/useHelpStore'
import { useLayoutStore } from '../../store/useLayoutStore'
import { InfoBarWrapper } from '../../style/infobar'
import Graph from '../mex/Graph/Graph'
import DataInfoBar from '../mex/Sidebar/DataInfoBar'
import SuggestionInfoBar from '../mex/Suggestions'

const InfoBarItems = () => {
  const graphData = useGraphData()
  const infobar = useLayoutStore((s) => s.infobar)

  switch (infobar.mode) {
    case 'graph':
      return <Graph graphData={graphData} />
    case 'flow':
      return <SyncBlockInfo />
    case 'default':
      return <DataInfoBar />
    case 'suggestions':
      return <SuggestionInfoBar />
    default:
      return <DataInfoBar />
  }
}

const InfoBar = () => {
  const focusMode = useLayoutStore((s) => s.focusMode)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { getFocusProps } = useLayout()

  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleSyncBlocks, toggleGraph, toggleSuggestedNodes } = useToggleElements()
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showGraph.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showGraph, () => {
          toggleGraph()
        })
      },
      [shortcuts.showSyncBlocks.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSyncBlocks, () => {
          toggleSyncBlocks()
        })
      },
      [shortcuts.showSuggestedNodes.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSuggestedNodes, () => {
          toggleSuggestedNodes()
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <InfoBarWrapper wide={infobar.mode === 'default' ? 'false' : 'true'} {...getFocusProps(focusMode)}>
      <InfoBarItems />
    </InfoBarWrapper>
  )
}

export default InfoBar
