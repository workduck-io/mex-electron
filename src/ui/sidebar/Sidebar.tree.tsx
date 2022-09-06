import { SidebarListFilter } from '@components/mex/Sidebar/SidebarList.style'
import Tree from '@components/mex/Sidebar/Tree'
import { getTitleFromPath } from '@hooks/useLinks'
import { getPartialTreeFromLinks, getTreeFromLinks } from '@hooks/useTreeFromLinks'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { useEditorStore } from '@store/useEditorStore'
import { Input } from '@style/Form'
import { fuzzySearch } from '@utils/lib/fuzzySearch'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { tinykeys } from '@workduck-io/tinykeys'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { ILink } from '../../types/Types'
import { MexTreeWrapper, SpaceList } from './Sidebar.style'

interface SpaceTreeProps {
  items: ILink[]
  filterText?: string
}

/**
 * Tree for mex
 *
 * - Displayes items in a Tree
 * - Filterable
 */
export const MexTree = ({ items, filterText }: SpaceTreeProps) => {
  /* To Add
   *
   * - MultiSelect
   * - Drop to Different space
   */
  const node = useEditorStore((store) => store.node)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number>(-1)
  const { goTo } = useRouting()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const initTree = useMemo(() => getTreeFromLinks(items), [node, items])

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const getFilteredData = (search) => {
    const filteredItems: ILink[] = fuzzySearch(items, search, (item) => getTitleFromPath(item.path))
    const { tree, matchedFlatItems } = getPartialTreeFromLinks(filteredItems, items)
    return { tree, matchedFlatItems }
  }

  const { filteredTree, matchedFlatItems } = useMemo(() => {
    if (search !== '') {
      const { tree, matchedFlatItems } = getFilteredData(search)
      // mog('Search', { tree, matchedFlatItems })
      return { filteredTree: tree, matchedFlatItems }
    } else {
      return { filteredTree: undefined, matchedFlatItems: [] }
    }
  }, [search, items])

  const reset = () => {
    setSearch('')
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const selectedItem = useMemo(() => {
    if (selected >= 0 && matchedFlatItems.length > 0 && matchedFlatItems.length > selected) {
      return matchedFlatItems[selected]
    } else return undefined
  }, [selected, matchedFlatItems])

  const onOpenItem = (nodeid: string) => {
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

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
            // Select the item
            // const item = listItems[selected]
            if (selectedItem) {
              onOpenItem(selectedItem.data.nodeid)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          // Circular increment
          setSelected((selected + 1) % matchedFlatItems.length)
        },
        ArrowUp: (event) => {
          event.stopPropagation()
          // Circular decrement with no negative
          setSelected((selected - 1 + matchedFlatItems.length) % matchedFlatItems.length)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [matchedFlatItems, selected])

  // mog('Selected', { matchedFlatItems, selected, selectedItem })

  return (
    <MexTreeWrapper>
      <SidebarListFilter noMargin>
        <Icon icon={searchLine} />
        <Input
          placeholder={filterText ?? 'Filter items'}
          onChange={debounce((e) => onSearchChange(e), 250)}
          ref={inputRef}
          // onKeyUp={debounce(onKeyUpSearch, 250)}
        />
      </SidebarListFilter>
      <SpaceList>
        <Tree initTree={filteredTree ? filteredTree : initTree} selectedItemId={selectedItem?.data?.nodeid} />
      </SpaceList>
    </MexTreeWrapper>
  )
}
