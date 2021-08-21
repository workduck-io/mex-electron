import { mix } from 'polished'
import { DefaultTheme, useTheme } from 'styled-components'
import useDataStore, { getLevel } from '../../Editor/Store/DataStore'
import { getNodeIdLast, isParent, isTopNode } from '../Sidebar/treeUtils'

interface GraphNode {
  id: number;
  nodeId: string;
  label: string;
  color: {
    border: string;
    background: string;
    highlight: {
      border: string;
      background: string;
    };
    hover: {
      border: string;
      background: string;
    };
  };
  font?: {
    color?: string;
    face?: string;
    size?: string;
  };
  size?: number;
}

interface GraphEdge {
  from: number;
  to: number;
  color?: string;
  physics?: boolean;
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
  const ilinks = useDataStore(store => store.ilinks)
  const links = ilinks.map(i => i.text)

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

  nodes.forEach(node => {
    nodes.forEach(compNode => {
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
