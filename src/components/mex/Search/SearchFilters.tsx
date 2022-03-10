import React, { useMemo } from 'react'
import { FilterKey, SearchFilter, useFilters } from '../../../hooks/useFilters'
import { SearchFilterList, SearchFilterStyled } from '../../../style/Search'
import { mog } from '../../../utils/lib/helper'

interface SearchFiltersProps<Item> {
  result: Item[]
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  addCurrentFilter: (filter: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  resetCurrentFilters: () => void
}

const getGroupedFilters = <Item,>(filters: SearchFilter<Item>[], currentFilters: SearchFilter<Item>[]) => {
  // Remove current filters from filters
  const suggestedFilters = filters.filter(
    (filter) => !currentFilters.find((currentFilter) => currentFilter.id === filter.id)
  )

  const filtersByKey: {
    [key: string]: {
      current: SearchFilter<Item>[]
      suggested: SearchFilter<Item>[]
    }
  } = {}

  suggestedFilters.forEach((filter) => {
    const key = filter.key as FilterKey
    if (!filtersByKey[key]) {
      filtersByKey[key] = {
        current: [],
        suggested: []
      }
    }
    filtersByKey[key].suggested.push(filter)
  })

  currentFilters.forEach((filter) => {
    const key = filter.key as FilterKey
    if (!filtersByKey[key]) {
      filtersByKey[key] = {
        current: [],
        suggested: []
      }
    }
    filtersByKey[key].current.push(filter)
  })

  return { filtersByKey }
}

const SearchFilters = <Item,>({
  filters,
  currentFilters,
  addCurrentFilter,
  result,
  removeCurrentFilter,
  resetCurrentFilters
}: SearchFiltersProps<Item>) => {
  const { filtersByKey } = useMemo(() => getGroupedFilters(filters, currentFilters), [filters, currentFilters, result])
  mog('SearchFilters', { filters, currentFilters, filtersByKey })

  return (
    <SearchFilterList>
      {Object.entries(filtersByKey).map(([k, filter]) => {
        return (
          <SearchFilterList key={`filter_options${k}`}>
            <p>{k}</p>
            {filter.current.map((f) => (
              <SearchFilterStyled
                selected
                key={`current_f_${f.id}`}
                onClick={() => {
                  removeCurrentFilter(f)
                  // updateResults()
                }}
              >
                {f.label}
              </SearchFilterStyled>
            ))}
            {filter.suggested.map((f) => (
              <SearchFilterStyled
                key={`suggested_f_${f.id}`}
                onClick={() => {
                  addCurrentFilter(f)
                  // updateResults()
                }}
              >
                {f.label}
              </SearchFilterStyled>
            ))}
          </SearchFilterList>
        )
      })}
      {currentFilters.length > 0 && <button onClick={() => resetCurrentFilters()}>Reset</button>}
    </SearchFilterList>
  )
}

export default SearchFilters
