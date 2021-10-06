import { useTheme } from 'styled-components'
import { useLinks } from '../../Editor/Actions/useLinks'
import useDataStore, { getLevel } from '../../Editor/Store/DataStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { NodeLink } from '../../Types/relations'
import { getNodeIdLast, isParent, isTopNode } from '../Sidebar/treeUtils'
import { GraphEdge, GraphNode } from './Graph.types'
import { getEdgeGlobalStyles, getEdgeLocalStyles, getNodeStyles } from './GraphHelpers'
import { useGraphStore } from './GraphStore'

export const useGraphData = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const links = ilinks.map((i) => i.text)
  const nodeId = useEditorStore((store) => store.node.id)
  const uid = useEditorStore((store) => store.node.uid)

  const showLocal = useGraphStore((state) => state.showLocal)

  const { getLinks, getNodeIdFromUid } = useLinks()

  const theme = useTheme()

  const nodes = links.map((node, id): GraphNode => {
    const level = getLevel(node)
    return {
      id: id + 1,
      label: showLocal ? node : getNodeIdLast(node),
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
              ...getEdgeGlobalStyles(level, theme)
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
          ...getEdgeGlobalStyles(0, theme)
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
  const nodeLinks = getLinks(uid).map((l) => ({
    from: getNodeIdFromUid(l.from),
    to: getNodeIdFromUid(l.to)
  }))
  const newNodes = filterNodeInLinks(nodeId, nodes, nodeLinks)

  if (newNodes.length === 0) {
    newNodes.push({
      id: 2,
      nodeId,
      label: nodeId,
      ...getNodeStyles(0, theme)
    })
  }

  nodeLinks.forEach((l) =>
    edges.push({
      to: getNodeNumId(l.to, newNodes),
      from: getNodeNumId(l.from, newNodes),
      ...getEdgeLocalStyles(l.to === nodeId, theme)
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
