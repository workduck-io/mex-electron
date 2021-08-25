import { mix } from 'polished'
import { DefaultTheme, useTheme } from 'styled-components'
import { useLinks } from '../../Editor/Actions/useLinks'
import useDataStore, { getLevel } from '../../Editor/Store/DataStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { NodeLink } from '../../Types/relations'
import { getNodeIdLast, isParent, isTopNode } from '../Sidebar/treeUtils'
import { useGraphStore } from './GraphStore'

interface GraphNode {
  id: number
  nodeId: string
  label: string
  color: {
    border: string
    background: string
    highlight: {
      border: string
      background: string
    }
    hover: {
      border: string
      background: string
    }
  }
  font?: {
    color?: string
    face?: string
    size?: string
  }
  size?: number
}

interface GraphEdge {
  to: number
  from: number
  color?: string
  physics?: boolean
}

const getNodeStyles = (level: number, theme: DefaultTheme) => {
  const { gray, primary } = theme.colors

  const step = 0.3

  const colorBase = mix(0.15, gray[3], mix(0.9, gray[10], primary))
  const fontColorBase = mix(0.75, gray[2], primary)

  const color = mix(level * step, gray[10], colorBase)
  const fontColor = mix((level * step) / 2, gray[8], fontColorBase)

  return {
    color: {
      border: color,
      background: color,
      highlight: {
        border: mix(0.1, primary, color),
        background: mix(0.2, primary, color)
      },
      hover: {
        border: mix(0.2, primary, color),
        background: mix(0.3, primary, color)
      }
    },
    font: {
      color: fontColor
    },
    shape: 'box'
    // size: 16 / (0.66 * (level * 0.75 + 1)),
  }
}

const getEdgeStyles = (level: number, theme: DefaultTheme) => {
  const { gray, primary } = theme.colors

  const step = 0.1
  const colorBase = mix(0.15, gray[5], mix(0.5, gray[6], primary))
  const color = mix(level * step, gray[10], colorBase)

  return {
    color
  }
}

export const useGraphData = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const links = ilinks.map((i) => i.text)
  const nodeId = useEditorStore((store) => store.node.id)

  const showLocal = useGraphStore((state) => state.showLocal)

  const { getLinks } = useLinks()

  const theme = useTheme()

  const nodes = links.map((node, id): GraphNode => {
    const level = getLevel(node)
    return {
      id: id + 1,
      label: getNodeIdLast(node),
      nodeId: node,
      ...getNodeStyles(level, theme)
    }
  })

  const edges: GraphEdge[] = []

  if (!showLocal) {
    nodes.forEach((node) => {
      nodes.forEach((compNode) => {
        if (node.id !== compNode.id) {
          const level = getLevel(compNode.nodeId)
          if (isParent(node.nodeId, compNode.nodeId)) {
            edges.push({
              to: node.id,
              from: compNode.id,
              ...getEdgeStyles(level, theme)
            })
          }

          // Uncomment to show links of any level of parent
          /* else if (isElder(node.label, compNode.label)) {
          edges.push({
            to: node.id,
            from: compNode.id,
            color: '#5e6c92',
            // physics: false,
          });
        } */
        }
      })
      if (isTopNode(node.nodeId)) {
        edges.push({
          to: node.id,
          from: 0,
          ...getEdgeStyles(0, theme)
        })
      }
    })

    nodes.push({
      id: 0,
      nodeId: 'root',
      label: 'root',
      ...getNodeStyles(0, theme)
    })

    return {
      nodes,
      edges
    }
  }

  // Filter for the local graph here
  const nodeLinks = getLinks(nodeId)
  const newNodes = filterNodeInLinks(nodeId, nodes, nodeLinks)

  nodeLinks.forEach((l) =>
    edges.push({
      to: getNodeNumId(l.to, newNodes),
      from: getNodeNumId(l.from, newNodes)
    })
  )

  return {
    nodes: newNodes,
    edges: edges
  }
}

const getNodeNumId = (id: string, nodes: GraphNode[]): number => {
  const fNodes = nodes.filter((n) => n.nodeId === id)
  if (fNodes.length === 1) return fNodes[0].id
  return -1
}

const filterNodeInLinks = (id: string, nodes: GraphNode[], links: NodeLink[]) => {
  const fLinks = links
    .filter((n) => n.from === id || n.to === id)
    .map((n) => [n.from, n.to])
    .flat()

  const fNodes = nodes.filter((n) => fLinks.indexOf(n.nodeId) !== -1)
  return fNodes
}
