import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import Graph from '../Components/Graph/Graph'
import { useGraphData } from '../Components/Graph/useGraphData'
import { useHelpStore } from '../Components/Help/HelpModal'
import { useFocusTransition } from '../Components/Sidebar'
import DataInfoBar from '../Components/Sidebar/DataInfoBar'
import SyncBlockInfo from '../Editor/Components/SyncBlock/SyncBlockInfo'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import { size } from '../Styled/responsive'

interface InfoBarWrapperProps {
  wide: boolean
}

export const InfoBarWrapper = styled(animated.div)<InfoBarWrapperProps>`
  overflow: hidden;

  @media (max-width: ${size.wide}) {
    min-width: ${({ wide, theme }) => {
      const mainWidth = wide ? '600px' : '300px'
      return `calc(${mainWidth} )`
    }};
  }
  @media (min-width: ${size.wide}) {
    min-width: ${({ wide, theme }) => {
      const mainWidth = wide ? '800px' : '300px'
      return `calc(${mainWidth} )`
    }};
  }
`
interface InfoBarProps {
  showGraph: boolean
  showSyncBlocks: boolean
}
const InfoBarItems = ({ showGraph, showSyncBlocks }: InfoBarProps) => {
  const graphData = useGraphData()
  if (showGraph) {
    return <Graph graphData={graphData} />
  }
  if (showSyncBlocks) {
    return <SyncBlockInfo />
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
        <InfoBarWrapper wide={showGraph || showSyncBlocks} style={styles}>
          <InfoBarItems showGraph={showGraph} showSyncBlocks={showSyncBlocks} />
        </InfoBarWrapper>
      )
  )
}

export default InfoBar
