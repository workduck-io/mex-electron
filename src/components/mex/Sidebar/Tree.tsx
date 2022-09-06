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
import { getTreeFromLinks } from '@hooks/useTreeFromLinks'
import useDataStore from '@store/useDataStore'
import { useEditorStore } from '@store/useEditorStore'
import { useTreeStore } from '@store/useTreeStore'
import Tippy, { useSingleton } from '@tippyjs/react'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { useRefactorStore } from '../Refactor/Refactor'
import { RenderTreeItem } from './TreeItem'
import { getNameFromPath, SEPARATOR } from './treeUtils'
// import { complexTree } from '../mockdata/complexTree'

interface TreeProps {
  initTree: TreeData
  selectedItemId?: string
}

const Tree = ({ initTree, selectedItemId }: TreeProps) => {
  const [tree, setTreeState] = React.useState<TreeData>(initTree)
  const [contextOpenNodeId, setContextOpenNodeId] = useState<string>(null)
  const location = useLocation()

  useEffect(() => {
    setTreeState(initTree)
  }, [initTree])

  // const node = useEditorStore((state) => state.node)
  const expandNode = useTreeStore((state) => state.expandNode)
  const collapseNode = useTreeStore((state) => state.collapseNode)
  const prefillModal = useRefactorStore((state) => state.prefillModal)
  const { goTo } = useRouting()

  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)

  const draggedRef = useRef<TreeItem | null>(null)

  const changeTree = (newTree: TreeData) => {
    setTreeState(() => newTree)
  }

  const [source, target] = useSingleton()

  const onOpenItem = (itemId: string, nodeid: string) => {
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    if (e.button === 0) {
      expandNode(item.data.path)
      onOpenItem(item.id as string, item.data.nodeid)
    }
  }

  const isInEditor = location.pathname.startsWith(ROUTE_PATHS.node)

  const renderItem = (renderProps: RenderItemParams) => {
    return (
      <RenderTreeItem
        {...renderProps}
        onClick={onClick}
        match={match}
        isInEditor={isInEditor}
        isHighlighted={renderProps.item?.data?.nodeid === selectedItemId}
        target={target}
        contextOpenNodeId={contextOpenNodeId}
        setContextOpenNodeId={setContextOpenNodeId}
      />
    )
  }

  const onExpand = (itemId: ItemId) => {
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
    </>
  )
}

export const TreeContainer = () => {
  const node = useEditorStore((store) => store.node)
  const ilinks = useDataStore((store) => store.ilinks)

  const initTree = useMemo(() => getTreeFromLinks(ilinks), [node, ilinks])

  return <Tree initTree={initTree} />
}

export default Tree
