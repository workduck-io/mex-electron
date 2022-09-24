import React, { useEffect } from 'react'
import filter2Line from '@iconify/icons-ri/filter-2-line'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { Filter, Filters, FilterType, FilterValue } from '../../../types/filters'
import { mog } from '@workduck-io/mex-utils'
import { Icon } from '@iconify/react'
import { GenericFlex, FilterMenuDiv } from './Filter.style'
import { FilterTypeIcons } from '@utils/lib/icons'
import { useFilterIcons } from '@hooks/ui/useFilterValueIcons'
import { generateFilterId } from '@data/Defaults/idPrefixes'
import { useEnableShortcutHandler } from '@hooks/useShortcutListener'
import { tinykeys } from '@workduck-io/tinykeys'
import { DisplayShortcut } from '@workduck-io/mex-components'

interface NewFilterMenuProps {
  filters: Filters
  addFilter: (filter: Filter) => void
}

const NewFilterClassName = 'new-filter-menu'

const NewFilterMenu = ({ addFilter, filters }: NewFilterMenuProps) => {
  const { getFilterValueIcon } = useFilterIcons()
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const onAddNewFilter = (type: FilterType, value: FilterValue) => {
    const newFilter: Filter = {
      id: generateFilterId(),
      type,
      multiple: true,
      // Be default the newly added filter has 'any' join
      join: 'any',
      values: [value]
    }
    // mog('onAddNewFilter', { type, newFilter, value })
    addFilter(newFilter)
  }

  // mog('NewFilterMenu', { filters })

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      'Shift+F': (event) => {
        enableShortcutHandler(
          () => {
            event.preventDefault()
            event.stopPropagation()
            const newFilterMenus = document.getElementsByClassName(NewFilterClassName)
            if (newFilterMenus.length > 0) {
              // Open the first menu as there will be never more than one
              const first = newFilterMenus[0] as HTMLElement
              first.click()
            }
          },
          {
            skipLocal: false,
            ignoreClasses: 'input'
          }
        )
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Menu
      className={NewFilterClassName}
      values={
        <FilterMenuDiv>
          <Icon icon={filter2Line} />
          Filter
          <DisplayShortcut shortcut={'Shift+F'} />
        </FilterMenuDiv>
      }
    >
      {filters.map((option) => (
        <Menu
          key={option.type}
          values={
            <GenericFlex>
              <Icon icon={FilterTypeIcons[option.type]} />
              {option.label}
            </GenericFlex>
          }
          allowSearch
          searchPlaceholder={`Search ${option.label}`}
        >
          {option.options
            .sort((a, b) => (a.count !== undefined && b.count !== undefined ? b.count - a.count : 0))
            .map((op) => (
              <MenuItem
                key={op.id}
                icon={getFilterValueIcon(option.type, op.value)}
                onClick={() => onAddNewFilter(option.type, op)}
                label={op.label}
                count={op.count}
              />
            ))}
        </Menu>
      ))}
    </Menu>
  )
}

export default NewFilterMenu

//////// Testing things
//
// const valueOptions = (k: string): FilterValue[] =>
//   duplicateTimes([`${k} Test 1`, `${k} Test 2`, `${k} Test 3`, `${k} Test 4`, `${k} Test 5`], 20).map((value, i) => ({
//     id: `${value}_${i}`,
//     label: `${value}_${i}`,
//     value
//   }))
//
// const TypeOptions = ['note', 'tag', 'mention', 'space'].map((type) => ({
//   label: capitalize(type),
//   value: type as FilterType,
//   options: valueOptions(type)
// }))
