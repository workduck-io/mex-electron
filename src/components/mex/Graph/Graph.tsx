import { ForceGraph2D, ForceGraph3D } from 'react-force-graph'
import equal from 'fast-deep-equal'
import React, { useEffect, useRef, useState } from 'react'
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
import { CSS2DObject, CSS2DRenderer } from './CSS2Drenderer'
import THREE from 'three'
import { mog } from '@workduck-io/mex-utils'
import { IconButton } from '@workduck-io/mex-components'
import more2Fill from '@iconify/icons-ri/more-2-fill'

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
  graphData: { nodes: any; links: any }
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
  const fullscreen = useGraphStore((state) => state.fullscreen)
  const toggleFullscreen = useGraphStore((state) => state.toggleFullscreen)

  const showLocal = useGraphStore((state) => state.showLocal)
  const toggleLocal = useGraphStore((state) => state.toggleLocal)
  // const [network, setNetwork] = useState<any>()

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
  }, [wrapperRef.current, fullscreen])

  const fgRef = useRef<any>(null)

  const handleClick = React.useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 180
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)

      // const node = graphData.nodes.filter((n: any) => n.id === nodes[0])[0]
      if (!node.path.startsWith('SERVICE') && node.id !== 0) {
        mog('Click', { node })
        setSelectedNode(node)
        setNodePreview(true)
      }
      if (fgRef.current) {
        fgRef?.current?.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
          node, // lookAt ({ x, y, z })
          3000 // ms transition duration
        )
      }
    },
    [fgRef]
  )

  const extraRenderers = [new CSS2DRenderer({})]

  return (
    <InfobarFull id={`graph_${showLocal ? 'local' : 'global'}`}>
      <GraphWrapper fullscreen={fullscreen} ref={wrapperRef}>
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

            <IconButton
              size={24}
              icon={fullscreen ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen'}
              title="Fullscreen"
              onClick={() => {
                toggleFullscreen()
              }}
            />
          </InfobarTools>
        ) : null}
        {showNodePreview && <NodePreview node={selectedNode} fullscreen={fullscreen} />}
        <ForceGraph3D
          width={state.dimensions.width}
          height={state.dimensions.height}
          extraRenderers={extraRenderers as any}
          // width={window.innerWidth}
          // height='calc(100vh - 15.5rem)'
          backgroundColor={theme.colors.background.sidebar}
          graphData={state.graph}
          nodeColor={(node: any) => (node.id === selectedNode?.id ? theme.colors.primary : node.color.background)}
          nodeThreeObject={(node: any) => {
            const nodeEl = document.createElement('div')
            nodeEl.textContent = getTitleFromPath(node.path).slice(0, 20)
            nodeEl.style.color = node.color.font
            nodeEl.style.backgroundColor = node.color.border
            nodeEl.className = 'node-label'
            if (selectedNode && selectedNode.id === node.id) {
              nodeEl.style.color = theme.colors.text.oppositePrimary
              nodeEl.style.backgroundColor = theme.colors.primary
            }
            return new CSS2DObject(nodeEl)
          }}
          linkOpacity={0.3}
          linkWidth={(link: any) =>
            link.source === selectedNode?.id || link.target === selectedNode?.id ? 0.5 : undefined
          }
          linkColor={(link: any) =>
            link.source === selectedNode?.id || link.target === selectedNode?.id ? theme.colors.primary : link.color
          }
          ref={fgRef}
          onNodeClick={handleClick}
          nodeThreeObjectExtend={true}
          // nodeThreeObject={(node) => {
          //   const sprite = new SpriteText(getTitleFromPath(node.path).slice(0, 20))
          //   sprite.color = node.color.font
          //   sprite.backgroundColor = node.color.background
          //   sprite.padding = 2
          //   sprite.borderRadius = 2
          //   sprite.textHeight = 8
          //   return sprite
          // }}
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
