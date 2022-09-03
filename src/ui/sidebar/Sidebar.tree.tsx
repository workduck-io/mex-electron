import { fuzzySearch } from '@utils/lib/fuzzySearch'
import Tree from '@components/mex/Sidebar/Tree'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useEditorStore } from '@store/useEditorStore'
import { debounce } from 'lodash'
import { ILink } from '../../types/Types'
import { SidebarListFilter } from '@components/mex/Sidebar/SidebarList.style'
import { Icon } from '@iconify/react'
import searchLine from '@iconify/icons-ri/search-line'
import { Input } from '@style/Form'
import { mog } from '@utils/lib/helper'
import { getPartialTreeGroups } from '@utils/lib/paths'
import { getPartialTreeFromLinks, getTreeFromLinks } from '@hooks/useTreeFromLinks'
import { TreeData } from '@atlaskit/tree'
import { getTitleFromPath } from '@hooks/useLinks'
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

  const inputRef = React.useRef<HTMLInputElement>(null)

  const initTree = useMemo(() => getTreeFromLinks(items), [node, items])

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const getFilteredData = (search) => {
    const filtered: ILink[] = fuzzySearch(items, search, (item) => getTitleFromPath(item.path))
    const filteredTree = getPartialTreeFromLinks(filtered, items)
    return filteredTree
  }

  const filteredTree = useMemo(() => {
    if (search !== '') {
      // mog('Search', { search, filtered, filteredTree })
      const filtered = getFilteredData(search)
      return filtered
    } else {
      return undefined
    }
  }, [search, items])

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
        <Tree initTree={filteredTree ? filteredTree : initTree} />
      </SpaceList>
    </MexTreeWrapper>
  )
}
