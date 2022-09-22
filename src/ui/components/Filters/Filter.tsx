import { Filter, FilterJoin, FilterType, FilterValue } from '../../../types/filters'
import React from 'react'
import { capitalize, mog } from '@workduck-io/mex-utils'
import { FilterJoinDiv, FilterValueDiv, FilterWrapper, FilterRemoveButton, FilterTypeDiv } from './Filter.style'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'

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
 * Icon for the filter type and the respective values has to be set
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

      <FilterTypeDiv>{capitalize(filter.type)}</FilterTypeDiv>
      {/*
        Can change the filter join
        Join options are always all, any, notAny, none
      */}
      <Menu
        allowSearch
        searchPlaceholder="Search Notes"
        values={
          <>
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
        {/*
        <MenuItem
          label="Undo"
          onClick={() => {
            console.log('what are we now')
          }}
        />
        <MenuItem
          label="Redo"
          onClick={() => {
            console.log('what are we now just wind')
          }}
        />
        <MenuItem label="Cut" disabled />
        <Menu label="Copy as">
          <MenuItem label="Text" />
          <MenuItem label="Video" />
          <Menu label="Image">
            <MenuItem label=".png" />
            <MenuItem label=".jpg" />
            <MenuItem label=".svg" />
            <MenuItem label=".gif" />
          </Menu>
          <MenuItem label="Audio" />
        </Menu>
        <Menu label="Share">
          <MenuItem label="Mail" />
          <MenuItem label="Instagram" />
        </Menu>
        */}
      </Menu>
      <Menu values={<FilterJoinDiv>{capitalize(filter.join)}</FilterJoinDiv>}>
        {JoinOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => onChangeJoin(option.value)} label={option.label} />
        ))}
      </Menu>
      {/* Conditionally render values if value is an array otherwise simple */}
      <FilterRemoveButton onClick={() => onRemoveFilter(filter)}>x</FilterRemoveButton>
    </FilterWrapper>
  )
}

export default FilterRender
