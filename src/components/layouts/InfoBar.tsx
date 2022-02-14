import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import { useGraphData } from '../../hooks/useGraphData'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import SyncBlockInfo from '../../editor/Components/SyncBlock/SyncBlockInfo'
import DataInfoBar from '../mex/Sidebar/DataInfoBar'

import Graph from '../mex/Graph/Graph'
import { useFocusTransition } from '../../hooks/useFocusTransition'
import useToggleElements from '../../hooks/useToggleElements'
import { useKeyListener } from '../../hooks/useShortcutListener'
import { useHelpStore } from '../../store/useHelpStore'
import { size } from '../../style/responsive'
import SuggestionInfoBar from '../mex/Suggestions'

interface InfoBarWrapperProps {
  wide: string
}

export const InfoBarWrapper = styled(animated.div)<InfoBarWrapperProps>`
  overflow-x: hidden;
  height: 100vh;

  @media (max-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '600px' : '300px'
      return `calc(${mainWidth})`
    }};
  }
  @media (min-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '800px' : '300px'
      return `calc(${mainWidth})`
    }};
  }
`

export const TemplateInfoBar = styled(InfoBarWrapper)`
  /* overflow-y: scroll; */
  height: 100%;
`

const InfoBarItems = () => {
  const graphData = useGraphData()
  const { showGraph, showSyncBlocks, showSuggestedNodes } = useToggleElements()

  if (showGraph) {
    return <Graph graphData={graphData} />
  }
  if (showSyncBlocks) {
    return <SyncBlockInfo />
  }

  if (showSuggestedNodes) {
    return <SuggestionInfoBar />
  }

  return <DataInfoBar />
}

const InfoBar = () => {
  const { transitions } = useFocusTransition()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const { showGraph, showSyncBlocks, toggleSyncBlocks, toggleGraph } = useToggleElements()
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showGraph.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showGraph, () => {
          if (showSyncBlocks) toggleSyncBlocks()
          toggleGraph()
        })
      },
      [shortcuts.showSyncBlocks.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSyncBlocks, () => {
          if (showGraph) toggleGraph()
          toggleSyncBlocks()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, showGraph, showSyncBlocks])

  return transitions(
    (styles, item) =>
      item && (
        <InfoBarWrapper wide={showGraph || showSyncBlocks ? 'true' : 'false'} style={styles}>
          <InfoBarItems />
        </InfoBarWrapper>
      )
  )
}

export default InfoBar
