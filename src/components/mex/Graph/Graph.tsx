import { useWindowSize } from '@hooks/ui/windowSize'
import { useLayoutStore } from '@store/useLayoutStore'
import { IconButton } from '@workduck-io/mex-components'
import { mog } from '@workduck-io/mex-utils'
import equal from 'fast-deep-equal'
import React, { useEffect, useRef, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'
import { useTheme } from 'styled-components'
import { getTitleFromPath } from '../../../hooks/useLinks'
import { useGraphStore } from '../../../store/useGraphStore'
import { InfobarButtons, InfobarFull, InfobarTools } from '../../../style/infobar'
import Switch from '../Forms/Switch'
import { CSS2DObject, CSS2DRenderer } from './CSS2Drenderer'
import { GraphWrapper } from './Graph.styles'
import NodePreview from './NodePreview'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TreeGraphProps {
  graphData: { nodes: any; links: any }
}

export const TreeGraph = (props: TreeGraphProps) => {
  const { graphData } = props

  const showTools = useGraphStore((state) => state.showTools)

  const showNodePreview = useGraphStore((state) => state.showNodePreview)
  const selectedNode = useGraphStore((state) => state.selectedNode)
  const setNodePreview = useGraphStore((state) => state.setNodePreview)
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode)
  const fullscreen = useGraphStore((state) => state.fullscreen)
  const toggleFullscreen = useGraphStore((state) => state.toggleFullscreen)
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)

  const showLocal = useGraphStore((state) => state.showLocal)
  const toggleLocal = useGraphStore((state) => state.toggleLocal)
  // const [network, setNetwork] = useState<any>()

  const theme = useTheme()

  const windowSize = useWindowSize()

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
  }, [wrapperRef.current, fullscreen, rhSidebar, windowSize])

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

            <InfobarButtons>
              <IconButton
                size={24}
                icon={'mdi:fit-to-page-outline'}
                title="Fit to screen"
                onClick={() => {
                  if (fgRef.current) fgRef.current.zoomToFit(400)
                }}
              />
              <IconButton
                size={24}
                icon={fullscreen ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen'}
                title="Fullscreen"
                onClick={() => {
                  toggleFullscreen()
                }}
              />
            </InfobarButtons>
          </InfobarTools>
        ) : null}
        {showNodePreview && <NodePreview node={selectedNode} fullscreen={fullscreen} />}
        <ForceGraph3D
          width={state.dimensions.width}
          height={state.dimensions.height}
          extraRenderers={extraRenderers as any}
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
          linkDirectionalArrowLength={showLocal ? 1.5 : undefined}
          linkDirectionalArrowRelPos={showLocal ? 0.5 : undefined}
          linkCurvature={showLocal ? 0.25 : undefined}
          linkColor={(link: any) =>
            link.source === selectedNode?.id || link.target === selectedNode?.id ? theme.colors.primary : link.color
          }
          ref={fgRef}
          onNodeClick={handleClick}
          nodeThreeObjectExtend={true}
        />
      </GraphWrapper>
      {/* <NodeServices /> */}
    </InfobarFull>
  )
}

export default TreeGraph
