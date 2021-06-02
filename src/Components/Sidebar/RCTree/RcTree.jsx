/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
import Tree from 'rc-tree';
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */
import PropTypes from 'prop-types';
import React from 'react';
// import TreeNode from '../../../Types/tree';
import RCIcon from './RCIcon';
import { SRCTree } from './styles';

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: (node) => {
    console.log('Start Motion:', node); /* eslint-disable-line no-console */
    return { height: 0 };
  },
  onAppearActive: (node) => ({ height: node.scrollHeight }),
  onLeaveStart: (node) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

class RCTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gData: props.tree,
      autoExpandParent: true,
      expandedKeys: ['pursuits'],
    };
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onDragEnter = (expandedKeys) => {
    // console.log('enter', expandedKeys);
    this.setState({
      expandedKeys,
    });
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onDrop = (info) => {
    // console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const loop = (data, key, callback) => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };

    const { gDataS } = this.state;
    const data = [...gDataS];

    // Find dragObject
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let dragObj;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      loop(data, dropKey, (item) => {
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
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      let ar;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      let i;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      loop(data, dropKey, (_item, index, arr) => {
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
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys); /* eslint-disable-line no-console */
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const { expandedKeys, autoExpandParent, gData } = this.state;

    return (
      <SRCTree className="mex_tree">
        {/* All styles are applied in SRCTree due to class-based styling of tree */}
        <Tree
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          autoExpandParent={autoExpandParent}
          draggable
          switcherIcon={RCIcon}
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          treeData={gData}
          motion={motion}
        />
      </SRCTree>
    );
  }
}

RCTree.propTypes = {
  tree: PropTypes.instanceOf(Array),
};

RCTree.defaultProps = {
  tree: [],
};

export default RCTree;
