import { useLastOpened } from '@hooks/useLastOpened'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { ItemContent, ItemCount, ItemTitle, UnreadIndicator, StyledTreeItem } from '@style/Sidebar'
import checkboxBlankCircleFill from '@iconify/icons-ri/checkbox-blank-circle-fill'
import Tippy from '@tippyjs/react'
import React, { useMemo } from 'react'
import { LastOpenedState } from '../../../types/userPreference'
import { SidebarListItem } from './SidebarList.types'
import { TooltipContent } from './TreeItem'
import { Entity } from '@mex-types/data'

interface SidebarListItemProps<T> {
  tippyTarget: any
  item: SidebarListItem<T>
  index: number

  select: {
    selectedItemId?: string
    selectIndex?: number
    onSelect: (itemId: string) => void
  }

  // To render the context menu if the item is right-clicked
  contextMenu: {
    ItemContextMenu?: (props: { item: SidebarListItem<T> }) => JSX.Element
    setContextOpenViewId: (viewId: string) => void
    contextOpenViewId: string
  }
}

const SidebarListItemComponent = <T extends Entity>({
  tippyTarget,
  select,
  index,
  item,
  contextMenu
}: SidebarListItemProps<T>) => {
  const { ItemContextMenu, setContextOpenViewId, contextOpenViewId } = contextMenu
  const { selectedItemId, selectIndex, onSelect } = select

  const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[item?.lastOpenedId])
  const { getLastOpened } = useLastOpened()

  const lastOpenedState = useMemo(() => {
    const loState = getLastOpened(item?.lastOpenedId, lastOpenedNote)
    return loState
  }, [lastOpenedNote, item?.lastOpenedId])

  const isUnread = useMemo(() => {
    return lastOpenedState === LastOpenedState.UNREAD
  }, [lastOpenedState])

  return (
    <Tippy
      theme="mex"
      placement="right"
      singleton={tippyTarget}
      key={`DisplayTippy_${item.id}`}
      content={<TooltipContent item={{ id: item.id, children: [], data: { title: item.label } }} />}
    >
      <span>
        <ContextMenu.Root
          onOpenChange={(open) => {
            if (open && ItemContextMenu) {
              setContextOpenViewId(item.id)
            } else setContextOpenViewId(null)
          }}
        >
          <ContextMenu.Trigger asChild>
            <StyledTreeItem
              hasMenuOpen={contextOpenViewId === item.id || selectIndex === index}
              noSwitcher
              isUnread={isUnread}
              selected={item?.id === selectedItemId}
            >
              <ItemContent onClick={() => onSelect(item?.id)}>
                <ItemTitle>
                  <Icon icon={item.icon} />
                  <span>{item.label}</span>
                </ItemTitle>
              </ItemContent>
              {isUnread && (
                <ItemCount>
                  <UnreadIndicator>
                    <Icon icon={checkboxBlankCircleFill} />
                  </UnreadIndicator>
                </ItemCount>
              )}
            </StyledTreeItem>
          </ContextMenu.Trigger>
          {ItemContextMenu && <ItemContextMenu item={{ ...item, lastOpenedState }} />}
        </ContextMenu.Root>
      </span>
    </Tippy>
  )
}

export default SidebarListItemComponent
