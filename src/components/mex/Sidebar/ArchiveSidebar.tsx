import React, { useMemo } from 'react'
import Tree, { RenderItemParams, ItemId, mutateTree, TreeItem, TreeData } from '@atlaskit/tree'
import Tippy, { useSingleton } from '@tippyjs/react'
import useDataStore, { useTreeFromLinks } from '@store/useDataStore'
import { GetIcon, TooltipContent } from './Tree'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { ItemContent, ItemCount, ItemTitle, StyledTreeItem } from '@style/Sidebar'
import { mog } from '@utils/lib/helper'
import { TreeContextMenu } from './TreeWithContextMenu'
import { useMatch } from 'react-router-dom'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { Icon } from '@iconify/react'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'

const ArchiveTree: React.FC<{ tree: any }> = ({ tree }) => {
  const [archiveTree, setArchiveTree] = React.useState(tree)

  const { goTo } = useRouting()
  const [source, target] = useSingleton()
  const match = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)

  const onExpand = (itemId: ItemId) => {
    mog('ON EXPAND ITEM ', { itemId })
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: true }))
  }

  const changeTree = (newTree: TreeData) => {
    setArchiveTree(() => newTree)
  }

  const onCollapse = (itemId: ItemId) => {
    mog('ON Collapse ITEM ', { itemId })
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: false }))
  }

  const onOpenItem = (itemId: string, nodeid: string) => {
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: true }))
    goTo(ROUTE_PATHS.archive, NavigationType.push, nodeid)
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    if (e.button === 0) {
      onOpenItem(item.id as string, item.data.nodeid)
    }
  }

  const renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {
    const title = item.data ? item.data.title : 'No Title'

    return (
      <Tippy theme="mex" placement="right" singleton={target} content={<TooltipContent item={item} />}>
        <span>
          <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
              <StyledTreeItem
                ref={provided.innerRef}
                selected={item.data && match?.params?.nodeid === item.data.nodeid}
                onContextMenu={(e) => {
                  mog('ContextySe', { e, item })
                }}
                {...provided.draggableProps}
              >
                <GetIcon item={item} onExpand={onExpand} onCollapse={onCollapse} />

                <ItemContent onMouseDown={(e) => onClick(e, item)}>
                  <ItemTitle>
                    <Icon icon={item.data.mex_icon ?? fileList2Line} />
                    <span>{title}</span>
                  </ItemTitle>
                </ItemContent>
                {item.hasChildren && item.children && item.children.length > 0 && (
                  <ItemCount>{item.children.length}</ItemCount>
                )}
              </StyledTreeItem>
            </ContextMenu.Trigger>
            <TreeContextMenu item={item} />
          </ContextMenu.Root>
        </span>
      </Tippy>
    )
  }

  return (
    <>
      <Tippy theme="mex" placement="right" singleton={source} />
      <Tree
        offsetPerLevel={16}
        tree={archiveTree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        isNestingEnabled
      />
    </>
  )
}

const ArchiveSidebar = () => {
  const archiveNotes = useDataStore((store) => store.archive)
  const { getTreeFromLinks } = useTreeFromLinks()

  const tree = useMemo(
    () => getTreeFromLinks(archiveNotes),

    [archiveNotes]
  )

  return (
    <>
      <ArchiveTree tree={tree} />
    </>
  )
}

export default ArchiveSidebar
