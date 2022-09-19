import { ForceGraph2D, ForceGraph3D } from 'react-force-graph'
import equal from 'fast-deep-equal'
import React, { useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'
import { getTitleFromPath, useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useGraphStore } from '../../../store/useGraphStore'
import { InfobarFull, InfobarTools } from '../../../style/infobar'
import Switch from '../Forms/Switch'
import { GraphWrapper } from './Graph.styles'
import NodePreview from './NodePreview'
import SpriteText from 'three-spritetext'
import { useTheme } from 'styled-components'

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
  const { getNodeidFromPath } = useLinks()

  const showTools = useGraphStore((state) => state.showTools)

  const showNodePreview = useGraphStore((state) => state.showNodePreview)
  const selectedNode = useGraphStore((state) => state.selectedNode)
  const setNodePreview = useGraphStore((state) => state.setNodePreview)
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode)

  const showLocal = useGraphStore((state) => state.showLocal)
  const toggleLocal = useGraphStore((state) => state.toggleLocal)
  const [network, setNetwork] = useState<any>()

  const theme = useTheme()

  const [state, setState] = useState({
    counter: showLocal ? -graphData.nodes.length : graphData.nodes.length,
    graph: graphData,
    dimensions: {
      height: 0,
      width: 0
    }
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

  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const { graph } = state
  console.log('Graph', { graph })
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
          const nodeid = getNodeidFromPath(node.path, node.namespace)
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

  const getColor = (n) => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0')
  const nodePaint = (node, color, ctx) => {
    const { id, x, y } = node
    ctx.fillStyle = color
    // ;[
    //   () => {
    //     ctx.fillRect(x - 6, y - 4, 12, 8)
    //   }, // rectangle
    //   () => {
    //     ctx.beginPath()
    //     ctx.moveTo(x, y - 5)
    //     ctx.lineTo(x - 5, y + 5)
    //     ctx.lineTo(x + 5, y + 5)
    //     ctx.fill()
    //   }, // triangle
    // () => {
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
    ctx.fill()
    // }, // circle
    // () => {
    // ctx.font = '10px Sans-Serif'
    // ctx.textAlign = 'center'
    // ctx.textBaseline = 'middle'
    // ctx.fillText(node.path, x, y)
    // } // text
    // ][id % 4]()
  }

  useEffect(() => {
    if (wrapperRef.current) {
      setState((prevState) => ({
        ...prevState,
        dimensions: {
          height: wrapperRef.current.clientHeight,
          width: wrapperRef.current.clientWidth
        }
      }))
    }
  }, [wrapperRef.current])

  return (
    <InfobarFull id={`graph_${showLocal ? 'local' : 'global'}`}>
      {showTools ? (
        <InfobarTools>
          {/* <IconButton size={24} icon={bubbleChartLine} title="Graph" highlight={showGraph} onClick={toggleGraph} />
          <IconButton
            size={24}
            icon={bubbleChartLine}
            shortcut={shortcuts.showGraph.keystrokes}
            title="Context View"
            highlight={infobar.mode === 'graph'}
            onClick={toggleGraph}
          />*/}
          <Switch
            showLabel
            id="LocalGraphSwitch"
            label="Show Local Graph"
            value={showLocal}
            onChange={() => toggleLocal()}
          />

          {/*<IconButton size={24} icon={more2Fill} title="Options" /> */}
        </InfobarTools>
      ) : null}
      {showNodePreview && <NodePreview node={selectedNode} />}
      <GraphWrapper ref={wrapperRef}>
        <ForceGraph3D
          width={state.dimensions.width}
          height={state.dimensions.height}
          // width={window.innerWidth}
          // height='calc(100vh - 15.5rem)'
          backgroundColor={theme.colors.background.sidebar}
          graphData={{ nodes: graph.nodes, links: graph.edges }}
          nodeLabel="path"
          // nodeCanvasObject={(node: any, ctx) => nodePaint(node as any, node.color.font, ctx)}
          linkColor={(link: any) => link.color}
          nodeThreeObject={(node) => {
            const sprite = new SpriteText(getTitleFromPath(node.path).slice(0, 20))
            sprite.color = node.color.font
            sprite.backgroundColor = node.color.background
            sprite.padding = 2
            sprite.borderRadius = 2
            sprite.textHeight = 8
            return sprite
          }}
        />
        {/*
        <ForceGraph2D
          nodeLabel="path"
          nodeCanvasObject={(node, ctx) => nodePaint(node as any, getColor(node.id), ctx)}
          graphData={{ nodes: graph.nodes, links: graph.edges }}

        />

            <Graph
          graph={graph}
          options={options}
          events={events}
          className="MEXnodeGraphSide"
          style={{ height: '100%' }}
          getNetwork={(p: any) => {
            setNetwork(p)
          }}
        /> */}
      </GraphWrapper>
      {/* <NodeServices /> */}
    </InfobarFull>
  )
}

export default TreeGraph
