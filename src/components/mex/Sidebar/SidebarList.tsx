import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { Input } from '@style/Form'
import { ItemContent, ItemTitle, StyledTreeItem } from '@style/Sidebar'
import Tippy, { useSingleton } from '@tippyjs/react'
import { fuzzySearch } from '@utils/lib/fuzzySearch'
import { mog } from '@utils/lib/helper'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { tinykeys } from '@workduck-io/tinykeys'
import { EmptyMessage, FilteredItemsWrapper, SidebarListFilter, SidebarListWrapper } from './SidebarList.style'
import { TooltipContent } from './TreeItem'
import { SidebarListProps } from './SidebarList.types'

const SidebarList = ({
  ItemContextMenu,
  selectedItemId,
  onClick,
  items,
  defaultItem,
  showSearch,
  searchPlaceholder,
  emptyMessage,
  noMargin
}: SidebarListProps) => {
  const [contextOpenViewId, setContextOpenViewId] = useState<string>(null)
  const [search, setSearch] = useState('')
  const [listItems, setListItems] = useState(items)

  const [selected, setSelected] = useState<number>(-1)

  const [source, target] = useSingleton()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const reset = () => {
    setSearch('')
    setListItems(items)
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
    setContextOpenViewId(null)
  }

  const onSelectItem = (id: string) => {
    setSelected(-1)
    setContextOpenViewId(null)
    onClick(id)
  }

  useEffect(() => {
    if (showSearch) {
      if (search && search !== '') {
        const filtered = fuzzySearch(items, search, (item) => item.title)
        mog('Search', { search, filtered })
        setListItems(filtered)
      }
      if (search === '') {
        setListItems(items)
      }
    }
  }, [search, showSearch, items])

  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = tinykeys(inputRef.current, {
        Escape: (event) => {
          event.stopPropagation()
          reset()
        },
        Enter: (event) => {
          event.stopPropagation()
          if (selected >= 0) {
            const item = listItems[selected]
            if (item) {
              onSelectItem(item.id)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          // Circular increment
          setSelected((selected + 1) % listItems.length)

          // if (selected < listItems.length - 1) {
          //   setSelected(selected + 1)
          // }
        },
        ArrowUp: (event) => {
          event.stopPropagation()
          // Circular decrement with no negative
          setSelected((selected - 1 + listItems.length) % listItems.length)
          // setSelected((selected - 1) % listItems.length)
          // if (selected > 0) {
          //   setSelected(selected - 1)
          // }
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [listItems, selected])

  return (
    <SidebarListWrapper noMargin={noMargin}>
      <Tippy theme="mex" placement="right" singleton={source} />

      {defaultItem && (
        <StyledTreeItem noSwitcher selected={selectedItemId === undefined}>
          <ItemContent onClick={() => onSelectItem(defaultItem.id)}>
            <ItemTitle>
              <Icon icon={defaultItem.icon} />
              <span>{defaultItem.title}</span>
            </ItemTitle>
          </ItemContent>
        </StyledTreeItem>
      )}

      {showSearch && items.length > 0 && (
        <SidebarListFilter noMargin={noMargin}>
          <Icon icon={searchLine} />
          <Input
            placeholder={searchPlaceholder ?? 'Filter items'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
            // onKeyUp={debounce(onKeyUpSearch, 250)}
          />
        </SidebarListFilter>
      )}

      <FilteredItemsWrapper hasDefault={!!defaultItem}>
        {listItems.map((item, index) => (
          <Tippy
            theme="mex"
            placement="right"
            singleton={target}
            key={`DisplayTippy_${item.id}`}
            content={<TooltipContent item={{ id: item.id, children: [], data: { title: item.title } }} />}
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
                    hasMenuOpen={contextOpenViewId === item.id || selected === index}
                    noSwitcher
                    selected={item?.id === selectedItemId}
                  >
                    <ItemContent onClick={() => onSelectItem(item?.id)}>
                      <ItemTitle>
                        <Icon icon={item.icon} />
                        <span>{item.title}</span>
                      </ItemTitle>
                    </ItemContent>
                  </StyledTreeItem>
                </ContextMenu.Trigger>
                {ItemContextMenu && <ItemContextMenu item={item} />}
              </ContextMenu.Root>
            </span>
          </Tippy>
        ))}
        {listItems.length === 0 && search !== '' && <EmptyMessage>{emptyMessage ?? 'No Items Found'}</EmptyMessage>}
      </FilteredItemsWrapper>
    </SidebarListWrapper>
  )
}

export default SidebarList
