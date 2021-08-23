import React from 'react'
import { useEditorStore } from '../Editor/Store/EditorStore'
import Graph from '../Components/Graph/Graph'
import { useGraphData } from '../Components/Graph/useGraphData'
import styled from 'styled-components'

const InfoBarWrapper = styled.div``

const InfoBar = () => {
  const showGraph = useEditorStore((state) => state.showGraph)

  const graphData = useGraphData()

  return <InfoBarWrapper>{showGraph && <Graph graphData={graphData} />}</InfoBarWrapper>
}

export default InfoBar
