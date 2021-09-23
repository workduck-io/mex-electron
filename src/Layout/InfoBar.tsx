import React, { useEffect, useState } from 'react'
import { useEditorStore } from '../Editor/Store/EditorStore'
import Graph from '../Components/Graph/Graph'
import { useGraphData } from '../Components/Graph/useGraphData'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import { useGraphStore } from '../Components/Graph/GraphStore'
import Backlinks from '../Components/Backlinks/Backlinks'
import { useLocation, useHistory } from 'react-router-dom'
import { useHelpStore } from '../Components/Help/HelpModal'
import { useLayoutStore } from './LayoutStore'
import { useWidthTransition } from '../Components/Sidebar'
import { animated } from 'react-spring'

const InfoBarWrapper = styled(animated.div)``

const InfoBar = () => {
  // const [showInfobar, setShowInfobar] = useState(false)
  const { transitions } = useWidthTransition()
  const infobarVisibile = useLayoutStore((store) => store.infobar.visible)
  const toggleInfobar = useLayoutStore((store) => store.toggleInfobar)
  const showInfobar = useLayoutStore((store) => store.showInfobar)
  const hideInfobar = useLayoutStore((store) => store.hideInfobar)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const location = useLocation()
  const history = useHistory()
  const graphData = useGraphData()

  React.useEffect(() => {
    if (location.pathname === '/editor') {
      showInfobar()
    } else {
      hideInfobar()
      if (showGraph) toggleGraph()
    }
  }, [location])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showGraph.keystrokes]: (event) => {
        event.preventDefault()
        toggleGraph()
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

  return transitions(
    (styles, item) =>
      item && (
        <InfoBarWrapper style={styles}>
          {infobarVisibile && (showGraph ? <Graph graphData={graphData} /> : <Backlinks />)}
        </InfoBarWrapper>
      )
  )
}

export default InfoBar
