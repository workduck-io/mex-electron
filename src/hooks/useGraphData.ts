import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { mog } from '@workduck-io/mex-utils'
import { useTheme } from 'styled-components'
import { GraphEdge, GraphNode } from '../components/mex/Graph/Graph.types'
import { ServiceImg } from '../components/mex/Graph/icons'
import { getNameFromPath, isParent, isTopNode } from '../components/mex/Sidebar/treeUtils'
import useDataStore, { getLevel } from '../store/useDataStore'
import { useEditorStore } from '../store/useEditorStore'
import { useGraphStore } from '../store/useGraphStore'
import { NodeLink } from '../types/relations'
import { getEdgeGlobalStyles, getEdgeLocalStyles, getNodeStyles } from '../utils/GraphHelpers'
import useIntents from './useIntents'
import { useLinks } from './useLinks'
import { useNamespaces } from './useNamespaces'

// const addServiceNodes = (
//   selectedNode: any,
//   theme: any,
//   nodes: GraphNode[],
//   edges: GraphEdge[],
//   nodeIntents: { intent: Intent; service: Service }[]
// ) => {}

export const useGraphData = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const { getDefaultNamespace, getNamespace } = useNamespaces()
  const currentnamespace = useUserPreferenceStore((store) => store.activeNamespace)
  const node = useEditorStore((store) => store.node)
  const selectedNode = useGraphStore((state) => state.selectedNode)

  const { path, nodeid } = node

  // * Service Nodes
  // const serviceNodes = useGraphStore((store) => store.serviceNodes)
  // const showServices = useGraphStore((store) => store.showServices)
  const { getNodeIntents } = useIntents()

  const showLocal = useGraphStore((state) => state.showLocal)

  const { getLinks, getPathFromNodeid, getNodeidFromPath } = useLinks()

  const theme = useTheme()

  const defaultNamespace = getDefaultNamespace()

  const currentNamespaceID = currentnamespace ? currentnamespace : defaultNamespace.id

  const currentNamespace = getNamespace(currentNamespaceID)

  /**
   * If show local then include all namespaces
   */
  const links = ilinks.filter((l) => showLocal || l.namespace === currentNamespaceID)
  const nodes = links.map((node, id): GraphNode => {
    const level = getLevel(node.path)
    return {
      id: id + 1,
      // label: showLocal ? node : getNameFromPath(node),
      // val: level,
      group: node.namespace,
      nodeid: node.nodeid,

      path: node.path,
      ...getNodeStyles(level, theme)
    }
  })

  const edges: GraphEdge[] = []

  if (!showLocal) {
    nodes.forEach((node) => {
      nodes.forEach((compNode) => {
        if (node.id !== compNode.id) {
          const level = getLevel(compNode.path)
          if (isParent(node.path, compNode.path)) {
            edges.push({
              source: node.id,
              target: compNode.id,
              ...getEdgeGlobalStyles(level, theme)
            })
          }
        }
      })
      if (isTopNode(node.path)) {
        edges.push({
          source: node.id,
          target: 0,
          ...getEdgeGlobalStyles(0, theme)
        })
      }
    })

    nodes.push({
      id: 0,
      path: currentNamespace?.name ?? 'Space',
      // label: 'root',
      ...getNodeStyles(0, theme)
    })

    return {
      nodes,
      links: edges
    }
  }

  // Filter for the local graph here
  const nodeLinks = getLinks(nodeid).map((l) => ({
    from: getPathFromNodeid(l.from),
    to: getPathFromNodeid(l.to)
  }))

  const newNodes = filterNodeInLinks(path, nodes, nodeLinks)

  if (newNodes.length === 0) {
    newNodes.push({
      id: 2,
      path,
      // label: path,
      ...getNodeStyles(0, theme)
    })
  }

  if (selectedNode) {
    const nodeid = getNodeidFromPath(selectedNode.path, selectedNode.namespace)
    if (nodeid) {
      const nodeIntents = getNodeIntents(nodeid) ?? []
      nodeIntents.forEach((nodeIntent, index) => {
        const serviceId = newNodes.length + (index + 1) * 3

        if (nodeIntent.intent) {
          // * Create service node
          newNodes.push({
            id: serviceId,
            // label: nodeIntent.service.name,
            path: `SERVICE_${nodeIntent.service.id}`,
            ...{
              ...getNodeStyles(0, theme),
              shape: 'circularImage',
              image: ServiceImg[nodeIntent.service.name.toUpperCase()]
            }
          })

          // * Attach this service node with Selected Node
          edges.push({
            source: serviceId,
            target: selectedNode.id,
            ...getEdgeGlobalStyles(0, theme)
          })

          const newServiceId = serviceId * 3
          // * Create Intent Type node
          newNodes.push({
            id: newServiceId,
            // label: nodeIntent.intent.name,
            path: `SERVICE_${nodeIntent.intent.value}`,
            ...getNodeStyles(0, theme)
          })

          // * Attach this intent type with service node
          edges.push({
            source: newServiceId,
            target: serviceId,
            ...getEdgeGlobalStyles(2, theme)
          })
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
      path: 'Service' + id + 100 + 1,
      ...getNodeStyles(id + 100 + 1, theme)
    }
  })

  services.forEach((service) => newNodes.push(service))
   */

  mog('newNodes', { newNodes, edges, nodeLinks })

  nodeLinks.forEach((l) => {
    const source = getNodeNumId(l.to, newNodes)
    const target = getNodeNumId(l.from, newNodes)

    if (source !== -1 && target !== -1) {
      edges.push({
        source,
        target,
        ...getEdgeLocalStyles(l.to === path, theme)
      })
    }
  })

  // mog('newNodes', { newNodes, edges, nodeLinks })

  return {
    nodes: newNodes,
    links: edges
  }
}

const getNodeNumId = (id: string, nodes: GraphNode[]): number => {
  const fNodes = nodes.filter((n) => n.path === id)
  if (fNodes.length === 1) return fNodes[0].id
  return -1
}

const filterNodeInLinks = (id: string, nodes: GraphNode[], links: NodeLink[]) => {
  const fLinks = links
    .filter((n) => n.from === id || n.to === id)
    .map((n) => [n.from, n.to])
    .flat()

  const fNodes = nodes.filter((n) => fLinks.indexOf(n.path) !== -1)
  return fNodes
}
