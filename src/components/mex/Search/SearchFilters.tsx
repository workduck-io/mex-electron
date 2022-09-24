import filter2Line from '@iconify/icons-ri/filter-2-line'
import filterOffLine from '@iconify/icons-ri/filter-off-line'
import { Icon } from '@iconify/react'
import FilterRender from '@ui/components/Filters/Filter'
import NewFilterMenu from '@ui/components/Filters/NewFilterMenu'
import { Infobox, ToolbarTooltip } from '@workduck-io/mex-components'
import { nanoid } from 'nanoid'
import React, { useMemo } from 'react'
import { SearchFiltersHelp } from '../../../data/Defaults/helpText'
import { SearchFilterCancel, SearchFilterLabel, SearchFiltersWrapper, SearchFilterWrapper } from '../../../style/Search'
import { Filter, Filters } from '../../../types/filters'
import { mog } from '../../../utils/lib/helper'

interface SearchFiltersProps {
  result?: any
  filters: Filters
  currentFilters: Filter[]
  addCurrentFilter: (filter: Filter) => void
  removeCurrentFilter: (filter: Filter) => void
  changeCurrentFilter: (filter: Filter) => void
  resetCurrentFilters: () => void
}

const SearchFilters = ({
  filters,
  currentFilters,
  addCurrentFilter,
  changeCurrentFilter,
  result,
  removeCurrentFilter,
  resetCurrentFilters
}: SearchFiltersProps) => {
  const randomId = useMemo(() => nanoid(), [filters, currentFilters])

  // mog('SearchFilters', { filters, currentFilters, filtersByKey })

  return (
    <SearchFilterWrapper>
      <SearchFilterLabel>
        {currentFilters.length > 0 ? (
          <ToolbarTooltip content={'Clear all filters'}>
            <SearchFilterCancel onClick={() => resetCurrentFilters()}>
              <Icon icon={filterOffLine} />
            </SearchFilterCancel>
          </ToolbarTooltip>
        ) : (
          <Icon icon={filter2Line} />
        )}
        <Infobox text={SearchFiltersHelp} />
      </SearchFilterLabel>
      <SearchFiltersWrapper key={`Filters_${randomId}`}>
        <NewFilterMenu
          filters={filters}
          addFilter={(f) => {
            mog('addFilter in SearchFilters', { f })
            addCurrentFilter(f)
          }}
        />
        {currentFilters.map((filter) => (
          <FilterRender
            key={filter.id}
            filter={filter}
            options={filters.find((f) => f.type === filter.type)?.options}
            onChangeFilter={(f) => changeCurrentFilter(f)}
            onRemoveFilter={(f) => removeCurrentFilter(f)}
          />
        ))}
      </SearchFiltersWrapper>
    </SearchFilterWrapper>
  )
}

export default SearchFilters
