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
import { useTimout } from '@hooks/useRelativeTime'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { useTreeFromLinks } from '@store/useDataStore'
import Tippy, { useSingleton } from '@tippyjs/react'
import React, { memo, useEffect, useRef } from 'react'
import { useContextMenu } from 'react-contexify'
import { useLocation } from 'react-router-dom'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useNavigation } from '../../../hooks/useNavigation'
import { useAnalysisStore } from '../../../store/useAnalysis'
import { useEditorStore } from '../../../store/useEditorStore'
import { useTreeStore } from '../../../store/useTreeStore'
import {
  ItemContent,
  ItemCount,
  ItemTitle,
  StyledTreeItem,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher,
  TooltipContentWrapper,
  TooltipCount
} from '../../../style/Sidebar'
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
    return item?.isExpanded ? (
      <StyledTreeItemSwitcher onClick={() => onCollapse(item.id)}>
        <Icon icon={'ri:arrow-down-s-line'} />
      </StyledTreeItemSwitcher>
    ) : (
      <StyledTreeItemSwitcher onClick={() => onExpand(item.id)}>
        <Icon icon={'ri:arrow-right-s-line'} />
      </StyledTreeItemSwitcher>
    )
  }
  return <StyledTreeSwitcher></StyledTreeSwitcher>
}

const TooltipContent = ({ item }: { item: TreeItem }) => {
  return (
    <TooltipContentWrapper>
      {item.data.title}
      {item.data.tasks !== undefined && item.data.tasks > 0 && (
        <TooltipCount>
          <Icon icon="ri:task-line" />
          {item.data.tasks}
        </TooltipCount>
      )}
      {item.data.reminders !== undefined && item.data.reminders > 0 && (
        <TooltipCount>
          <Icon icon="ri:timer-flash-line" />
          {item.data.reminders}
        </TooltipCount>
      )}
    </TooltipContentWrapper>
  )
}

const ItemTitleWithAnalysis = ({ item }: { item: TreeItem }) => {
  const anal = useAnalysisStore((state) => state.analysis)
  const title =
    anal.nodeid && anal.nodeid === item.data.nodeid && anal.title !== undefined && anal.title !== ''
      ? anal.title
      : item.data
      ? item.data.title
      : 'NoTitle'

  return (
    <ItemTitle>
      <Icon icon={item.data.mex_icon ?? fileList2Line} />
      <span>{title}</span>
    </ItemTitle>
  )
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
  const location = useLocation()

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
    mog('renderTree', { initTree })
    setTreeState({ tree: initTree })
  }, [initTree])

  const [source, target] = useSingleton()

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
    const isInEditor = location.pathname.startsWith(ROUTE_PATHS.node)

    // mog('renderItem', { item, snapshot, provided, location, isInEditor })

    return (
      <Tippy theme="mex" placement="right" singleton={target} content={<TooltipContent item={item} />}>
        <StyledTreeItem
          ref={provided.innerRef}
          selected={isInEditor && node && item.data && node.nodeid === item.data.nodeid}
          isDragging={snapshot.isDragging}
          isBeingDroppedAt={isTrue}
          onContextMenu={(e) => show(e, { props: { id: item.data.nodeid, path: item.data.path } })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <GetIcon item={item} onExpand={onExpand} onCollapse={onCollapse} />

          <ItemContent onMouseDown={(e) => onClick(e, item)}>
            <ItemTitleWithAnalysis item={item} />
          </ItemContent>

          {item.hasChildren && item.children && item.children.length > 0 && (
            <ItemCount>{item.children.length}</ItemCount>
          )}
          {/* <AkNavigationItem
          text={item.data ? item.data.title : ''}
          icon={DragDropWithNestingTree.getIcon(item, onExpand, onCollapse)}
          dnd={{ dragHandleProps: provided.dragHandleProps }}
        /> */}
        </StyledTreeItem>
      </Tippy>
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
    let to: string | null = null
    if (toItem) {
      if (toItem.id === '1') {
        // Has been dropped on root
        to = getNameFromPath(from)
      } else {
        // Has been dropped inside some item
        to = `${toItem.data.path}${SEPARATOR}${getNameFromPath(from)}`
      }
    }
    mog('onDragEnd', { source, destination, to, from, toItem, tree })

    draggedRef.current = null

    prefillModal(from, to)
    // changeTree(newTree)
  }

  return (
    <>
      <Tippy theme="mex" placement="right" singleton={source} />
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

export const TreeContainer = () => {
  const initTree = useTreeFromLinks()

  return <Tree initTree={initTree} />
}

export default Tree
