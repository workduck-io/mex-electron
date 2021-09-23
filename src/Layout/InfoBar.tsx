import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import { size } from '../Styled/responsive'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import Backlinks from '../Components/Backlinks/Backlinks'
import Graph from '../Components/Graph/Graph'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { useGraphData } from '../Components/Graph/useGraphData'
import { useHelpStore } from '../Components/Help/HelpModal'
import { useWidthTransition } from '../Components/Sidebar'

interface InfoBarWrapperProps {
  showGraph: boolean
}

const InfoBarWrapper = styled(animated.div)<InfoBarWrapperProps>`
  overflow: hidden;

  @media (max-width: ${size.wide}) {
    max-width: ${({ showGraph }) => (showGraph ? '600px' : '300px')};
  }
  @media (min-width: ${size.wide}) {
    max-width: ${({ showGraph }) => (showGraph ? '800px' : '300px')};
  }
`

const InfoBar = () => {
  const { transitions } = useWidthTransition()
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const graphData = useGraphData()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showGraph.keystrokes]: (event) => {
        event.preventDefault()
        toggleGraph()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return transitions(
    (styles, item) =>
      item && (
        <InfoBarWrapper showGraph={showGraph} style={styles}>
          {showGraph ? <Graph graphData={graphData} /> : <Backlinks />}
        </InfoBarWrapper>
      )
  )
}

export default InfoBar
