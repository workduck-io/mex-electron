import React from 'react'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { FilterType, FilterValue } from '../../../types/filters'
import { capitalize, mog } from '@workduck-io/mex-utils'
import { duplicateTimes } from '@utils/lib/helper'

const valueOptions: FilterValue[] = duplicateTimes(
  ['a test', 'b test 2', 'c test 3', 'f test 4', 'e test 5', 'd test 6'],
  20
).map((value, i) => ({
  id: `${value}_${i}`,
  label: `${value}_${i}`,
  value
}))

const TypeOptions = ['note', 'tag', 'mention', 'space'].map((type) => ({
  label: capitalize(type),
  value: type as FilterType,
  options: valueOptions
}))

const NewFilterMenu = () => {
  const onAddNewFilter = (type: FilterType, value: FilterValue) => {
    mog('onAddNewFilter', { type, value })
  }

  return (
    <div>
      <Menu label="Filter">
        {TypeOptions.map((option) => (
          <Menu key={option.value} label={option.label} allowSearch searchPlaceholder={`Search ${option.label}`}>
            {option.options.map((op) => (
              <MenuItem key={op.id} onClick={() => onAddNewFilter(option.value, op)} label={op.label} />
            ))}
          </Menu>
        ))}
      </Menu>
    </div>
  )
}

export default NewFilterMenu
