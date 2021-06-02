/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
import RCTree from 'rc-tree';
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */
// eslint-disable no-explicit-any

import React from 'react';
import { StyledTree } from '../../Styled/Sidebar';
import TreeExpandIcon from './Icon';

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: (node: any) => {
    // eslint-disable-next-line no-console
    console.log('Start Motion:', node);
    return { height: 0 };
  },
  onAppearActive: (node: any) => ({ height: node.scrollHeight }),
  onLeaveStart: (node: any) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

/* Renders a draggable tree with custom collapse-able icon */
class Tree extends React.Component<RCTreeProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      gData: props.tree,
      autoExpandParent: true,
      expandedKeys: ['lib'],
    };

    // These three functions were from the react-component/tree example
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onExpand = this.onExpand.bind(this);
  }

  onDragEnter({ expandedKeys }: any) {
    // eslint-disable-next-line no-console
    console.log('enter', expandedKeys);
    this.setState({
      expandedKeys,
    });
  }

  onDrop(info: any) {
    // eslint-disable-next-line no-console
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: any, callback: any) => {
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
    const { gData: gDataTemp }: any = this.state;
    const data = [...gDataTemp];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
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
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      let ar: any;
      let i: any;
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

    this.setState({
      gData: data,
    });
  }

  onExpand(expandedKeys: any) {
    // eslint-disable-next-line no-console
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  render() {
    const { expandedKeys, gData, autoExpandParent }: any = this.state;

    return (
      <StyledTree className="draggable-demo">
        <RCTree
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          autoExpandParent={autoExpandParent}
          draggable
          // onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          treeData={gData}
          motion={motion}
          switcherIcon={TreeExpandIcon}
          showIcon={false}
        />
      </StyledTree>
    );
  }
}

interface RCTreeProps {
  tree: any;
}

export default Tree;
