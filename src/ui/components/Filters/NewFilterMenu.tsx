import React from 'react'
import filter2Line from '@iconify/icons-ri/filter-2-line'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { Filter, FilterType, FilterValue } from '../../../types/filters'
import { capitalize, mog } from '@workduck-io/mex-utils'
import { duplicateTimes } from '@utils/lib/helper'
import { Icon } from '@iconify/react'
import { FilterTypeDiv, GenericFlex, GenericSection } from './Filter.style'
import { FilterTypeIcons } from '@utils/lib/icons'
import { useFilterIcons } from '@hooks/ui/useFilterValueIcons'
import { generateFilterId } from '@data/Defaults/idPrefixes'

const valueOptions = (k: string): FilterValue[] =>
  duplicateTimes([`${k} Test 1`, `${k} Test 2`, `${k} Test 3`, `${k} Test 4`, `${k} Test 5`], 20).map((value, i) => ({
    id: `${value}_${i}`,
    label: `${value}_${i}`,
    value
  }))

const TypeOptions = ['note', 'tag', 'mention', 'space'].map((type) => ({
  label: capitalize(type),
  value: type as FilterType,
  options: valueOptions(type)
}))

const defaultJoinForType = {
  note: 'any',
  tag: 'any',
  mention: 'any',
  space: 'any'
}

interface NewFilterMenuProps {
  addFilter: (filter: Filter) => void
}

const NewFilterMenu = ({ addFilter }: NewFilterMenuProps) => {
  const { getFilterValueIcon } = useFilterIcons()
  const onAddNewFilter = (type: FilterType, value: FilterValue) => {
    mog('onAddNewFilter', { type, value })
    const newFilter: Filter = {
      id: generateFilterId(),
      type,
      join: defaultJoinForType[type],
      values: [value]
    }
    addFilter(newFilter)
  }

  return (
    <Menu
      values={
        <GenericSection>
          <Icon icon={filter2Line} />
          Filter
        </GenericSection>
      }
    >
      {TypeOptions.map((option) => (
        <Menu
          key={option.value}
          values={
            <GenericFlex>
              <Icon icon={FilterTypeIcons[option.value]} />
              {option.label}
            </GenericFlex>
          }
          allowSearch
          searchPlaceholder={`Search ${option.label}`}
        >
          {option.options.map((op) => (
            <MenuItem
              key={op.id}
              icon={getFilterValueIcon(option.value, op.value)}
              onClick={() => onAddNewFilter(option.value, op)}
              label={op.label}
            />
          ))}
        </Menu>
      ))}
    </Menu>
  )
}

export default NewFilterMenu
