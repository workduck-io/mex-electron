import useDataStore, { getLevel } from '../../Editor/Store/DataStore';
import { palette } from '../../Styled/themes';
import { DefaultTheme, useTheme } from 'styled-components';
import { isElder, isParent, isTopNode } from '../Sidebar/sampleRCTreeData';
import { darken, lighten, mix } from 'polished';

interface GraphNode {
  id: number;
  label: string;
  color: string;
  font?: {
    color?: string;
    face?: string;
    size?: string;
  };
}

interface GraphEdge {
  from: number;
  to: number;
  color?: string;
  physics?: boolean;
}

export const useGraphData = () => {
  const ilinks = useDataStore(store => store.ilinks);
  const links = ilinks.map(i => i.text);

  const theme = useTheme();

  const { primary, gray, secondary } = theme.colors;

  const getColor = (l: number) => mix(0.05, primary, lighten(0.025 * (5 - l), gray[10]));
  const getFontColor = (l: number) => mix(0.45, gray[4], darken(0.05 * (5 - l), primary));

  const nodes = links.map((node, id): GraphNode => {
    const level = getLevel(node);
    return {
      id: id + 1,
      label: node,
      color: getColor(level),
      font: { color: getFontColor(level) },
    };
  });

  const edges: GraphEdge[] = [];

  nodes.forEach(node => {
    nodes.forEach(compNode => {
      if (node.id !== compNode.id) {
        if (isParent(node.label, compNode.label)) {
          edges.push({
            to: node.id,
            from: compNode.id,
            color: secondary,
          });
        }

        // else if (isElder(node.label, compNode.label)) {
        //   edges.push({
        //     to: node.id,
        //     from: compNode.id,
        //     color: '#5e6c92',
        //     // physics: false,
        //   });
        // }
      }
    });
    if (isTopNode(node.label)) {
      edges.push({
        to: node.id,
        from: 0,
        color: primary,
      });
    }
  });

  nodes.push({
    id: 0,
    label: 'root',
    color: getColor(0),
    font: {
      color: primary,
    },
  });

  return {
    nodes,
    edges,
  };
};
