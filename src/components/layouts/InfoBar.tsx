import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'

import DataInfoBar from '../mex/Sidebar/DataInfoBar'
import { FOCUS_MODE_OPACITY } from '../../style/consts'
import { FocusModeProp } from '../../style/props'
import Graph from '../mex/Graph/Graph'
import SuggestionInfoBar from '../mex/Suggestions'
import SyncBlockInfo from '../../editor/Components/SyncBlock/SyncBlockInfo'
import { size } from '../../style/responsive'
import tinykeys from 'tinykeys'
import { useGraphData } from '../../hooks/useGraphData'
import { useHelpStore } from '../../store/useHelpStore'
import { useKeyListener } from '../../hooks/useShortcutListener'
import { useLayoutStore } from '../../store/useLayoutStore'
import useToggleElements from '../../hooks/useToggleElements'
import useLayout from '../../hooks/useLayout'
import { focusStyles } from '../../style/focus'

interface InfoBarWrapperProps extends FocusModeProp {
  wide: string
}

export const InfoBarWrapper = styled.div<InfoBarWrapperProps>`
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
  transition: opacity 0.3s ease-in-out;
  ${focusStyles}
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

  // mog('Show Suggestions', { showSuggestedNodes, showGraph, showSyncBlocks })

  if (showSuggestedNodes) {
    return <SuggestionInfoBar />
  }

  return <DataInfoBar />
}

const InfoBar = () => {
  const focusMode = useLayoutStore((s) => s.focusMode)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { getFocusProps } = useLayout()

  const { showGraph, showSyncBlocks, toggleSyncBlocks, toggleGraph, showSuggestedNodes, toggleSuggestedNodes } =
    useToggleElements()
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
    <InfoBarWrapper
      wide={showGraph || showSyncBlocks || showSuggestedNodes ? 'true' : 'false'}
      {...getFocusProps(focusMode)}
    >
      <InfoBarItems />
    </InfoBarWrapper>
  )
}

export default InfoBar
