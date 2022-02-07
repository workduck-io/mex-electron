import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import more2Fill from '@iconify-icons/ri/more-2-fill'
import equal from 'fast-deep-equal'
import React, { useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useToggleElements from '../../../hooks/useToggleElements'
import { useGraphStore } from '../../../store/useGraphStore'
import IconButton from '../../../style/Buttons'
import Switch from '../Forms/Switch'
import { GraphTools, GraphWrapper, StyledGraph } from './Graph.styles'
import NodePreview from './NodePreview'

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = {
  autoResize: true,
  layout: {
    hierarchical: false
  },
  edges: {
    color: '#5e6c92',
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0.5
    }
  },
  nodes: {
    font: '16px Inter #7D90C3',
    scaling: {
      label: true
    },
    shape: 'dot'
  },
  physics: {
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.5,
      springLength: 75,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.5
    }
  }
}

interface TreeGraphProps {
  graphData: { nodes: any; edges: any }
}

export const TreeGraph = (props: TreeGraphProps) => {
  const { graphData } = props
  const { push } = useNavigation()
  const { getUidFromNodeId } = useLinks()

  const { showGraph, toggleGraph } = useToggleElements()

  const showTools = useGraphStore((state) => state.showTools)

  const showNodePreview = useGraphStore((state) => state.showNodePreview)
  const selectedNode = useGraphStore((state) => state.selectedNode)
  const setNodePreview = useGraphStore((state) => state.setNodePreview)
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode)

  const showLocal = useGraphStore((state) => state.showLocal)
  const toggleLocal = useGraphStore((state) => state.toggleLocal)
  const [network, setNetwork] = useState<any>()

  const [state, setState] = useState({
    counter: showLocal ? -graphData.nodes.length : graphData.nodes.length,
    graph: graphData
  })

  useEffect(() => {
    if (equal(state.graph, graphData)) return
    setState(({ graph: _, counter, ...rest }: any) => {
      const id = counter + 1
      return {
        graph: graphData,
        counter: id,
        ...rest
      }
    })
  }, [graphData]) // eslint-disable-line react-hooks/exhaustive-deps

  const { graph } = state
  // console.log('Graph', { graph });
  const events = {
    click: ({ nodes }: any) => {
      if (nodes.length === 1) {
        const node = graphData.nodes.filter((n: any) => n.id === nodes[0])[0]
        if (!node.path.startsWith('SERVICE')) {
          setSelectedNode(node)
          setNodePreview(true)
        }
      } else {
        setNodePreview(false)
        setSelectedNode(undefined)
      }
    },
    doubleClick: ({ nodes }: any) => {
      setNodePreview(false)
      setSelectedNode(undefined)

      if (nodes.length === 1) {
        const node = graphData.nodes.filter((n: any) => n.id === nodes[0])[0]
        if (!node.path.startsWith('SERVICE')) {
          const nodeid = getUidFromNodeId(node.path)
          push(nodeid)
        }
      }
    }
    // select: (selectProps: any): void => {
    //   if (selectProps.nodes.length === 1) {
    //     const selectId = selectProps.nodes[0]
    //     const selectNode = graphData.nodes.filter((n: any) => n.id === selectId)

    //     // console.log('Selected node', selectNode, selectId, graphData)

    //     // if (network) {
    //     //   network._callbacks.$select[0]({ nodes: selectNode })
    //     // }

    //     //
    //   }
    // }
  }

  return (
    <StyledGraph id={`graph_${showLocal ? 'local' : 'global'}`}>
      {showTools ? (
        <GraphTools>
          <IconButton size={24} icon={bubbleChartLine} title="Graph" highlight={showGraph} onClick={toggleGraph} />

          <Switch
            showLabel
            id="LocalGraphSwitch"
            label="Show Local Graph"
            value={showLocal}
            onChange={() => toggleLocal()}
          />

          <IconButton size={24} icon={more2Fill} title="Options" />
        </GraphTools>
      ) : null}
      {showNodePreview && <NodePreview node={selectedNode} />}
      <GraphWrapper>
        <Graph
          graph={graph}
          options={options}
          events={events}
          className="MEXnodeGraphSide"
          style={{ height: '100vh' }}
          getNetwork={(p: any) => {
            setNetwork(p)
          }}
        />
      </GraphWrapper>
      {/* <NodeServices /> */}
    </StyledGraph>
  )
}

export default TreeGraph
