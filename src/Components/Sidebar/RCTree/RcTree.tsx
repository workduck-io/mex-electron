/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
import Tree from 'rc-tree';
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */
import React, { useState } from 'react';
import TreeNode from '../../../Types/tree';
import RCIcon from './RCIcon';
import { SRCTree } from './styles';

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: (node: HTMLElement) => {
    console.log('Start Motion:', node); /* eslint-disable-line no-console */
    return { height: 0 };
  },
  onAppearActive: (node: HTMLElement) => ({ height: node.scrollHeight }),
  onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

interface RCTReeProps {
  tree: TreeNode[];
}

interface State {
  gData: TreeNode[];
  autoExpandParent: boolean;
  expandedKeys: string[];
}

const RCTree = ({ tree }: RCTReeProps) => {
  const [state, setState] = useState<State>({
    gData: tree,
    autoExpandParent: true,
    expandedKeys: ['pursuits'],
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const onDragEnter = (expandedKeys: any) => {
    // console.log('enter', expandedKeys);
    setState({
      ...state,
      expandedKeys,
    });
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const onDrop = (info: any) => {
    // console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const loop = (data: any, key: any, callback: any) => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      data.forEach((item: any, index: any, arr: any) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...state.gData];

    // Find dragObject
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let dragObj: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      let ar: any;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      let i: any;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      loop(data, dropKey, (_item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setState(() => ({
      ...state,
      gData: data,
    }));
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const onExpand = (expandedKeys: any[]) => {
    console.log('onExpand', expandedKeys); /* eslint-disable-line no-console */
    setState(() => ({
      ...state,
      expandedKeys,
      autoExpandParent: false,
    }));
  };

  return (
    <SRCTree className="mex_tree">
      {/* All styles are applied in SRCTree due to class-based styling of tree */}
      <Tree
        expandedKeys={state.expandedKeys}
        onExpand={onExpand}
        autoExpandParent={state.autoExpandParent}
        draggable
        switcherIcon={RCIcon}
        // onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={state.gData}
        motion={motion}
      />
    </SRCTree>
  );
};

export default RCTree;
