/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';

import Graph from 'react-vis-network-graph';

const StyledGraph = styled('div')`
  /* width: 100%; */
  max-height: 100vh;
  max-width: 40vw;
  width: calc(100vw - ${({ theme }) => theme.width.sidebar}px - ${({ theme }) => theme.width.nav}px - 800px);
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
    color: '#000000',
  },
};

function randomColor() {
  const red = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  const green = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  const blue = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0');
  return `#${red}${green}${blue}`;
}

export const TreeGraph = () => {
  const createNode = (x: any, y: any) => {
    const color = randomColor();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setState(({ graph: { nodes, edges }, counter, ...rest }: any) => {
      const id = counter + 1;
      const from = Math.floor(Math.random() * (counter - 1)) + 1;
      return {
        graph: {
          nodes: [...nodes, { id, label: `Node ${id}`, color, x, y }],
          edges: [...edges, { from, to: id }],
        },
        counter: id,
        ...rest,
      };
    });
  };

  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: [
        { id: 1, label: 'Node 1', color: '#e04141' },
        { id: 2, label: 'Node 2', color: '#e09c41' },
        { id: 3, label: 'Node 3', color: '#e0df41' },
        { id: 4, label: 'Node 4', color: '#7be041' },
        { id: 5, label: 'Node 5', color: '#41e0c9' },
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    },
    events: {
      select: ({ nodes, edges }: any) => {
        console.log('Selected nodes:');
        console.log(nodes);
        console.log('Selected edges:');
        console.log(edges);
        alert(`Selected node: ${nodes}`);
      },
      doubleClick: ({ pointer: { canvas } }: any) => {
        createNode(canvas.x, canvas.y);
      },
    },
  });

  const { graph, events } = state;
  return (
    <StyledGraph>
      <Graph graph={graph} options={options} events={events} style={{ height: '100vh' }} />
    </StyledGraph>
  );
};

export default TreeGraph;
