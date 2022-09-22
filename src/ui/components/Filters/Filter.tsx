import { Filter, FilterJoin, FilterType, FilterValue } from '../../../types/filters'
import React from 'react'
import { capitalize, mog } from '@workduck-io/mex-utils'
import closeLine from '@iconify/icons-ri/close-line'
import {
  FilterJoinDiv,
  FilterValueDiv,
  FilterWrapper,
  FilterRemoveButton,
  FilterTypeDiv,
  GenericFlex
} from './Filter.style'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { Icon } from '@iconify/react'
import { FilterTypeIcons } from '@utils/lib/icons'

interface FilterProps {
  filter: Filter
  options: FilterValue[]
  onChangeFilter: (filter: Filter) => void
  onRemoveFilter: (filter: Filter) => void
}

const JoinOptions = ['all', 'any', 'notAny', 'none'].map((join) => ({
  label: capitalize(join),
  value: join as FilterJoin
}))

/**
 * Renders a filter
 */
const FilterRender = ({ filter, onChangeFilter, options, onRemoveFilter }: FilterProps) => {
  // mog('Filter', { filter, options })
  const onChangeJoin = (join: FilterJoin) => {
    onChangeFilter({ ...filter, join })
  }

  const onChangeValues = (values: FilterValue | FilterValue[]) => {
    onChangeFilter({ ...filter, values })
  }

  return (
    <FilterWrapper>
      {/* Cannot change filter type */}
      <FilterTypeDiv>
        <Icon icon={FilterTypeIcons[filter.type]} />
        {capitalize(filter.type)}
      </FilterTypeDiv>

      {/*
        Can change the filter join
        Join options are always all, any, notAny, none
      */}
      <Menu values={<FilterJoinDiv>{capitalize(filter.join)}</FilterJoinDiv>}>
        {JoinOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => onChangeJoin(option.value)} label={option.label} />
        ))}
      </Menu>

      <Menu
        allowSearch
        searchPlaceholder="Search Notes"
        values={
          <>
            {/* Conditionally render values if value is an array otherwise simple */}
            {Array.isArray(filter.values) ? (
              filter.values.map((value) => <FilterValueDiv key={value.id}>{value.label}</FilterValueDiv>)
            ) : (
              <FilterValueDiv>{filter.values.label}</FilterValueDiv>
            )}
          </>
        }
      >
        {options.map((option) => (
          <MenuItem key={option.id} onClick={() => onChangeValues(option)} label={option.label} />
        ))}
      </Menu>

      <FilterRemoveButton onClick={() => onRemoveFilter(filter)}>
        <Icon height={16} icon={closeLine} />
      </FilterRemoveButton>
    </FilterWrapper>
  )
}

export default FilterRender
