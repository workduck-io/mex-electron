import React, { useEffect, useState } from 'react'
import { useEditorStore } from '../Editor/Store/EditorStore'
import Graph from '../Components/Graph/Graph'
import { useGraphData } from '../Components/Graph/useGraphData'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import { useGraphStore } from '../Components/Graph/GraphStore'
import Backlinks from '../Components/Backlinks/Backlinks'
import { useLocation, useHistory } from 'react-router-dom'

const InfoBarWrapper = styled.div``

const InfoBar = () => {
  const [showInfobar, setShowInfobar] = useState(false)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)
  const location = useLocation()
  const history = useHistory()
  const graphData = useGraphData()

  React.useEffect(() => {
    if (location.pathname === '/editor') {
      setShowInfobar(true)
    } else {
      setShowInfobar(false)
      if (showGraph) toggleGraph()
    }
  }, [location])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyG': (event) => {
        event.preventDefault()
        toggleGraph()
      },
      '$mod+Shift+KeyS': (event) => {
        event.preventDefault()
        history.push('/snippets')
      },
      '$mod+Shift+KeyE': (event) => {
        event.preventDefault()
        history.push('/editor')
      }
    })
    return () => {
      unsubscribe()
    }
  })

  return <InfoBarWrapper>{showInfobar && (showGraph ? <Graph graphData={graphData} /> : <Backlinks />)}</InfoBarWrapper>
}

export default InfoBar
