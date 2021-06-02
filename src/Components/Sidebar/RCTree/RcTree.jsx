/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
import Tree from 'rc-tree';
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */
import PropTypes from 'prop-types';
import React from 'react';
import RCIcon from './RCIcon';
import { SRCTree } from './styles';

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: (node) => {
    // eslint-disable-next-line no-console
    console.log('Start Motion:', node);
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
      expandedKeys: ['lib'],
    };

    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onExpand = this.onExpand.bind(this);
  }

  onDragEnter({ expandedKeys }) {
    // eslint-disable-next-line no-console
    console.log('enter', expandedKeys);
    this.setState({
      expandedKeys,
    });
  }

  onDrop(info) {
    // eslint-disable-next-line no-console
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
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
    const { gData: gDataTemp } = this.state;
    const data = [...gDataTemp];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
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
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
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

  onExpand(expandedKeys) {
    // eslint-disable-next-line no-console
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  render() {
    const { expandedKeys, gData, autoExpandParent } = this.state;

    return (
      <SRCTree className="draggable-demo">
        <Tree
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          autoExpandParent={autoExpandParent}
          draggable
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          treeData={gData}
          motion={motion}
          switcherIcon={RCIcon}
          showIcon={false}
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
