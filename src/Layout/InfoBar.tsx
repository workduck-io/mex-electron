import React, { useEffect } from 'react'
import { useEditorStore } from '../Editor/Store/EditorStore'
import Graph from '../Components/Graph/Graph'
import { useGraphData } from '../Components/Graph/useGraphData'
import styled from 'styled-components'
import tinykeys from 'tinykeys'

const InfoBarWrapper = styled.div``

const InfoBar = () => {
  const showGraph = useEditorStore((state) => state.showGraph)
  const toggleGraph = useEditorStore((state) => state.toggleGraph)

  const graphData = useGraphData()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyG': (event) => {
        event.preventDefault()
        toggleGraph()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  return <InfoBarWrapper>{showGraph && <Graph graphData={graphData} />}</InfoBarWrapper>
}

export default InfoBar
