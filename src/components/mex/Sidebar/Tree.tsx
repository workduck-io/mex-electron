import {
  default as AtlaskitTree,
  ItemId,
  mutateTree,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition
} from '@atlaskit/tree'

import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useRef } from 'react'
import { useContextMenu } from 'react-contexify'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useNavigation } from '../../../hooks/useNavigation'
import { useEditorStore } from '../../../store/useEditorStore'
import { useTreeStore } from '../../../store/useTreeStore'
import { ItemContent, ItemCount, ItemTitle, StyledTreeItem, StyledTreeItemSwitcher } from '../../../style/Sidebar'
import { mog } from '../../../utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { useRefactorStore } from '../Refactor/Refactor'
import { getNameFromPath, SEPARATOR } from './treeUtils'
import { MENU_ID, TreeContextMenu } from './TreeWithContextMenu'
// import { complexTree } from '../mockdata/complexTree'

interface GetIconProps {
  item: TreeItem
  onExpand: (itemId: ItemId) => void
  onCollapse: (itemId: ItemId) => void
}

const GetIcon = ({ item, onCollapse, onExpand }: GetIconProps) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <StyledTreeItemSwitcher onClick={() => onCollapse(item.id)}>
        <Icon icon={'ri:arrow-down-s-line'} />
      </StyledTreeItemSwitcher>
    ) : (
      <StyledTreeItemSwitcher onClick={() => onExpand(item.id)}>
        <Icon icon={'ri:arrow-right-s-line'} />
      </StyledTreeItemSwitcher>
    )
  }
  return <StyledTreeItemSwitcher></StyledTreeItemSwitcher>
}

interface TreeProps {
  initTree: TreeData
}

interface TreeLocalState {
  tree: TreeData
}

const Tree = ({ initTree }: TreeProps) => {
  const [treeState, setTreeState] = React.useState<TreeLocalState>({ tree: initTree })
  // const [draggedItem, setDraggedItem] = React.useState<TreeItem | null>(null)
  const node = useEditorStore((state) => state.node)
  const expandNode = useTreeStore((state) => state.expandNode)
  const collapseNode = useTreeStore((state) => state.collapseNode)
  const prefillModal = useRefactorStore((state) => state.prefillModal)
  const { push } = useNavigation()
  const { goTo } = useRouting()
  const { tree } = treeState
  // mog('renderTree', { initTree })
  //
  const draggedRef = useRef<TreeItem | null>(null)

  const changeTree = (newTree: TreeData) => {
    setTreeState((state) => ({ ...state, tree: newTree }))
  }
  //
  useEffect(() => {
    setTreeState({ tree: initTree })
  }, [initTree])

  const onOpenItem = (itemId: string, nodeid: string) => {
    push(nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const { show } = useContextMenu({
    id: MENU_ID
  })

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    // mog('onClick', { item })
    if (e.button === 0) {
      expandNode(item.data.path)
      onOpenItem(item.id as string, item.data.nodeid)
    }
  }
  const defaultSnap = {
    isDragging: false,
    isDropAnimating: false,
    dropAnimation: null,
    mode: null,
    draggingOver: null,
    combineTargetFor: null,
    combineWith: null
  }

  const renderItem = ({ item, onExpand, onCollapse, provided, snapshot }: RenderItemParams) => {
    const isTrue = JSON.stringify(snapshot) !== JSON.stringify(defaultSnap)

    if (isTrue) mog('renderItem', { item, snapshot, provided })

    return (
      <StyledTreeItem
        ref={provided.innerRef}
        selected={node && item.data && node.nodeid === item.data.nodeid}
        isDragging={snapshot.isDragging}
        isBeingDroppedAt={isTrue}
        onContextMenu={(e) => show(e, { props: { id: item.data.nodeid, path: item.data.path } })}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <GetIcon item={item} onExpand={onExpand} onCollapse={onCollapse} />

        <ItemContent onMouseDown={(e) => onClick(e, item)}>
          <ItemTitle>
            <Icon icon={item.data.icon ?? fileList2Line} />
            <span>{item.data ? item.data.title : 'No Title'}</span>
          </ItemTitle>
          {item.hasChildren && item.children && item.children.length > 0 && (
            <ItemCount>{item.children.length}</ItemCount>
          )}
        </ItemContent>

        {/* <AkNavigationItem
          text={item.data ? item.data.title : ''}
          icon={DragDropWithNestingTree.getIcon(item, onExpand, onCollapse)}
          dnd={{ dragHandleProps: provided.dragHandleProps }}
        /> */}
      </StyledTreeItem>
    )
  }

  const onExpand = (itemId: ItemId) => {
    // const { tree }: State = this.state
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      expandNode(item.data.path)
    }
    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const onCollapse = (itemId: ItemId) => {
    // const { tree }: State = this.state
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      collapseNode(item.data.path)
    }
    changeTree(mutateTree(tree, itemId, { isExpanded: false }))
  }

  const onDragStart = (itemId: ItemId) => {
    // const { tree }: State = this.state
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      draggedRef.current = item
    }
  }

  const onDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    // const { tree } = this.state

    if (!destination || !draggedRef.current) {
      draggedRef.current = null
      return
    }

    if (source === destination) {
      draggedRef.current = null
      return
    }

    if (source.parentId === destination.parentId) {
      return
    }

    const from = draggedRef.current.data.path
    const toItem = tree.items[destination.parentId]
    const to = toItem && `${toItem.data.path}${SEPARATOR}${getNameFromPath(from)}`
    // const newTree = moveItemOnTree(tree, source, destination)
    mog('onDragEnd', { source, destination, to, from, toItem, tree })

    draggedRef.current = null

    prefillModal(from, to)
    // changeTree(newTree)
  }

  // const { tree } = state

  return (
    <>
      <AtlaskitTree
        offsetPerLevel={16}
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        isDragEnabled
        isNestingEnabled
      />
      <TreeContextMenu />
    </>
  )
}

export default Tree
//
//
// OLD Tree
//
//

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */
// import equal from 'fast-deep-equal'
// import RCTree from 'rc-tree'
// import { Key } from 'rc-tree/lib/interface'
// import React, { memo } from 'react'
// import { IpcAction } from '../../../data/IpcAction'
// import { appNotifierWindow } from '../../../electron/utils/notifiers'
// import { AppType } from '../../../hooks/useInitialize'
// import { withNavigation } from '../../../hooks/useNavigation'
// import { withRefactor } from '../../../hooks/useRefactor'
// import { withNodeOps } from '../../../store/useEditorStore'
// import { StyledTree } from '../../../style/Sidebar'
// import TreeExpandIcon from './Icon'
// import { getNameFromPath, SEPARATOR } from './treeUtils'
// import { mog } from '../../../utils/lib/helper'

// const motion = {
//   motionName: 'node-motion',
//   motionAppear: false,
//   onAppearStart: (node: any) => {
//     // eslint-disable-next-line no-console
//     // console.log('Start Motion:', node)
//     return { height: 0 }
//   },
//   onAppearActive: (node: any) => ({ height: node.scrollHeight }),
//   onLeaveStart: (node: any) => ({ height: node.offsetHeight }),
//   onLeaveActive: () => ({ height: 0 })
// }

// interface RCTreeProps {
//   tree: any
//   currentNode: any
//   displayMenu: any
//   push: any
//   getMockRefactor: any
//   execRefactor: any
//   prefillRefactorModal: any
// }

// /* Renders a draggable tree with custom collapse-able icon */
// class Tree extends React.Component<RCTreeProps> {
//   constructor(props: RCTreeProps) {
//     super(props)
//     this.state = {
//       gData: props.tree,
//       autoExpandParent: true
//     }

//     // These three functions were from the react-component/tree example
//     this.onDragEnter = this.onDragEnter.bind(this)
//     this.onDrop = this.onDrop.bind(this)
//     this.onExpand = this.onExpand.bind(this)
//     this.onSelect = this.onSelect.bind(this)
//   }

//   componentDidUpdate(prevProps: RCTreeProps) {
//     const { tree } = this.props

//     if (!equal(prevProps, this.props)) {
//       // eslint-disable-next-line react/no-did-update-set-state
//       this.setState({ gData: tree, expandedKeys: [this.props.currentNode.id] })
//     }
//   }

//   onDragEnter({ expandedKeys }: any) {
//     // eslint-disable-next-line no-console
//     // console.log('enter', expandedKeys)
//     this.setState({
//       expandedKeys
//     })
//   }

//   onDrop(info: any) {
//     // eslint-disable-next-line no-console
//     // console.log('drop', info)
//     const dropKey = info.node.props.eventKey
//     const dragKey = info.dragNode.props.eventKey
//     const dropPos = info.node.props.pos.split('-')
//     const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

//     const loop = (data: any, key: any, callback: any) => {
//       data.forEach((item: any, index: any, arr: any) => {
//         if (item.key === key) {
//           callback(item, index, arr)
//           return
//         }
//         if (item.children) {
//           loop(item.children, key, callback)
//         }
//       })
//     }
//     const { gData: gDataTemp }: any = this.state
//     const data = [...gDataTemp]

//     // Find dragObject
//     let dragObj: any
//     loop(data, dragKey, (item: any, index: any, arr: any) => {
//       arr.splice(index, 1)
//       dragObj = item
//     })

//     if (!info.dropToGap) {
//       // Drop on the content
//       loop(data, dropKey, (item: any) => {
//         item.children = item.children || []
//         // where to insert
//         item.children.push(dragObj)
//       })
//     } else if (
//       (info.node.props.children || []).length > 0 && // Has children
//       info.node.props.expanded && // Is expanded
//       dropPosition === 1 // On the bottom gap
//     ) {
//       loop(data, dropKey, (item: any) => {
//         item.children = item.children || []
//         // where to insert
//         item.children.unshift(dragObj)
//       })
//     } else {
//       // Drop on the gap
//       let ar: any
//       let i: any
//       loop(data, dropKey, (_item: any, index: any, arr: any) => {
//         ar = arr
//         i = index
//       })
//       if (dropPosition === -1) {
//         ar.splice(i, 0, dragObj)
//       } else {
//         ar.splice(i + 1, 0, dragObj)
//       }
//     }

//     const singleId = getNameFromPath(dragKey)

//     const from = dragKey
//     const to = dropKey + SEPARATOR + singleId

//     const { prefillRefactorModal: prefillModal } = this.props

//     prefillModal(from, to)
//   }

//   onExpand(expandedKeys: any) {
//     if (expandedKeys) {
//       const { currentNode } = this.props
//       const newExp = expandedKeys.filter((k) => k)
//       const expKeys = Array.from(new Set([...newExp, currentNode.id]))
//       // console.log({ currentNode, expandedKeys, expKeys, newExp })

//       this.setState({
//         expandedKeys: expKeys,
//         autoExpandParent: true
//       })
//     }
//   }

//   onSelect(_selectedKeys: Key[], info: any) {
//     const { selectedNodes } = info
//     const { push } = this.props

//     if (selectedNodes.length > 0) {
//       const nodeid = selectedNodes[0].nodeid
//       push(nodeid)
//       appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
//     }
//   }

//   render() {
//     const { expandedKeys, autoExpandParent }: any = this.state
//     const { tree, currentNode, displayMenu } = this.props

//     // let newExpKeys = expandedKeys !== undefined ? [...expandedKeys, currentNode.key] : [currentNode.key]

//     return (
//       <StyledTree className="draggable-demo">
//         <RCTree
//           expandedKeys={expandedKeys}
//           onExpand={this.onExpand}
//           autoExpandParent={autoExpandParent}
//           draggable
//           // onDragStart={this.onDragStart}
//           // defaultExpandParent={}
//           onDragEnter={this.onDragEnter}
//           selectedKeys={[currentNode.id]}
//           onDrop={this.onDrop}
//           treeData={tree}
//           motion={motion}
//           switcherIcon={TreeExpandIcon}
//           showIcon={false}
//           onSelect={this.onSelect}
//           onRightClick={displayMenu}
//         />
//       </StyledTree>
//     )
//   }
// }

// export default withNavigation(withRefactor(withNodeOps(Tree)))
