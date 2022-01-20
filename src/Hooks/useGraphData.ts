import { GraphNode, GraphEdge } from '../components/mex/Graph/Graph.types'
import { ServiceImg } from '../components/mex/Graph/icons'
import { getNodeIdLast, isParent, isTopNode } from '../components/mex/Sidebar/treeUtils'
import { Intent, Service } from '../editor/Components/SyncBlock'
import useDataStore, { getLevel } from '../store/useDataStore'
import { useEditorStore } from '../store/useEditorStore'
import { useGraphStore } from '../store/useGraphStore'
import { NodeLink } from '../types/relations'
import { getNodeStyles, getEdgeGlobalStyles, getEdgeLocalStyles } from '../utils/GraphHelpers'
import { useTheme } from 'styled-components'
import useIntents from './useIntents'
import { useLinks } from './useLinks'

const addServiceNodes = (
  selectedNode: any,
  theme: any,
  nodes: GraphNode[],
  edges: GraphEdge[],
  nodeIntents: { intent: Intent; service: Service }[]
) => {}

export const useGraphData = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const links = ilinks.map((i) => i.text)
  const nodeId = useEditorStore((store) => store.node.id)
  const uid = useEditorStore((store) => store.node.uid)
  const selectedNode = useGraphStore((state) => state.selectedNode)

  // * Service Nodes
  const serviceNodes = useGraphStore((store) => store.serviceNodes)
  const showServices = useGraphStore((store) => store.showServices)
  const { getNodeIntents } = useIntents()

  const showLocal = useGraphStore((state) => state.showLocal)

  const { getLinks, getNodeIdFromUid, getUidFromNodeId } = useLinks()

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

  if (selectedNode) {
    const uid = getUidFromNodeId(selectedNode.nodeId)
    if (uid) {
      const nodeIntents = getNodeIntents(uid) ?? []
      nodeIntents.forEach((nodeIntent, index) => {
        const serviceId = newNodes.length + (index + 1) * 3

        if (nodeIntent.intent) {
          // * Create service node
          newNodes.push({
            id: serviceId,
            label: nodeIntent.service.name,
            nodeId: `SERVICE_${nodeIntent.service.id}`,
            ...{
              ...getNodeStyles(0, theme),
              shape: 'circularImage',
              image: ServiceImg[nodeIntent.service.name.toUpperCase()]
            }
          })

          // * Attach this service node with Selected Node
          edges.push({ from: serviceId, to: selectedNode.id, ...getEdgeGlobalStyles(0, theme) })

          const newServiceId = serviceId * 3
          // * Create Intent Type node
          newNodes.push({
            id: newServiceId,
            label: nodeIntent.intent.name,
            nodeId: `SERVICE_${nodeIntent.intent.value}`,
            ...getNodeStyles(0, theme)
          })

          // * Attach this intent type with service node
          edges.push({ from: newServiceId, to: serviceId, ...getEdgeGlobalStyles(2, theme) })
        }
      })
    }
  }

  /**
   * * Service list for all nodes
  const services = serviceNodes.map((service, id) => {
    return {
      id: id + 100 + 1,
      label: 'Slack',
      nodeId: 'Service' + id + 100 + 1,
      ...getNodeStyles(id + 100 + 1, theme)
    }
  })

  services.forEach((service) => newNodes.push(service))
   */

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
