import useDataStore from '../../Editor/Store/DataStore';
import { isElder, isParent, isTopNode } from '../Sidebar/sampleRCTreeData';

interface GraphNode {
  id: number;
  label: string;
  color: string;
}

interface GraphEdge {
  from: number;
  to: number;
  color?: string;
}

export const useGraphData = () => {
  const ilinks = useDataStore(store => store.ilinks);
  const links = ilinks.map(i => i.text);

  const nodes = links.map((node, id): GraphNode => {
    return {
      id: id + 1,
      label: node,
      color: '#4284ff',
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
            color: '#ffffff',
          });
        } else if (isElder(node.label, compNode.label)) {
          edges.push({
            to: node.id,
            from: compNode.id,
            color: '#5e6c92',
          });
        }
      }
    });
    if (isTopNode(node.label)) {
      edges.push({
        to: node.id,
        from: 0,
        color: '#00ff00',
      });
    }
  });

  nodes.push({
    id: 0,
    label: 'Root',
    color: '#9fe732',
  });

  return {
    nodes,
    edges,
  };
};
