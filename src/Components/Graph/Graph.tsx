/* eslint-disable @typescript-eslint/no-explicit-any */
import equal from 'fast-deep-equal';
import React, { useEffect, useState } from 'react';
import Graph from 'react-vis-network-graph';
import styled from 'styled-components';
import { useEditorStore } from '../../Editor/Store/EditorStore';

const StyledGraph = styled('div')`
  /* width: 100%; */
  max-height: 100vh;
  width: calc(100vw - ${({ theme }) => theme.width.sidebar}px - ${({ theme }) => theme.width.nav}px - 600px);
  position: fixed;
  top: 0;
  right: 0;
  /* border: 3px solid red; */
  * {
    outline: none;
    outline-style: none;
  }
`;

const options = {
  autoResize: true,
  layout: {
    hierarchical: false,
  },
  edges: {
    color: '#5e6c92',
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0.5,
    },
  },

  nodes: {
    font: '16px sans-serif #7D90C3',
    scaling: {
      label: true,
    },
  },
  physics: {
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 75,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0,
    },
  },
};

export const TreeGraph = (props: { graphData: { nodes: any; edges: any } }) => {
  const { graphData } = props;
  const loadNode = useEditorStore(state => state.loadNode);

  // console.log('Checking for graph data 12321: ', { graphData });

  const [state, setState] = useState({
    counter: graphData.nodes.length,
    graph: graphData,
    events: {
      select: (selectProps: any) => {
        // if (props.nodes.length === 1) {
        //   const node = graphData.nodes[props.nodes[0]].label;
        // }
        console.log(`Selected node: ${JSON.stringify(selectProps, null, 2)}`);
      },
    },
  });

  useEffect(() => {
    if (equal(state.graph, graphData)) return;
    setState(({ graph, counter, ...rest }: any) => {
      const id = counter + 1;
      return {
        graph: graphData,
        counter: id,
        ...rest,
      };
    });
  }, [graphData]);

  const { graph, events } = state;
  // console.log('Graph', { graph });

  return (
    <StyledGraph>
      <Graph graph={graph} options={options} events={events} style={{ height: '100vh' }} />
    </StyledGraph>
  );
};

export default TreeGraph;
