import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import React, { useState } from 'react'
import { FilterKey, SearchFilter } from '../../../hooks/useFilters'
import { Input } from '../../../style/Form'
import { startCase } from 'lodash'
import {
  SearchFilterInputWrapper,
  SearchFilterCategoryLabel,
  SearchFilterListCurrent,
  SearchFilterStyled,
  SearchFilterCount,
  SearchFilterListWrap
} from '../../../style/Search'
import {
  StyledCombobox,
  Suggestion,
  StyledMenu,
  StyledInputWrapper,
  FilterComboboxToggle
} from '../NodeSelect/NodeSelect.styles'
import IconDisplay from '@ui/components/IconPicker/IconDisplay'

interface SearchFilterInputProps<Item> {
  filterKey: FilterKey
  items: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  onChange: (item: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  icon: string
  placeholder?: string
}

const SearchFilterInput = <Item,>({
  items,
  icon,
  removeCurrentFilter,
  filterKey,
  currentFilters,
  onChange,
  placeholder
}: SearchFilterInputProps<Item>) => {
  const [inputItems, setInputItems] = useState(items)
  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    openMenu,
    highlightedIndex,
    setInputValue,
    getItemProps
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(items.filter((item) => item.label.toLowerCase().startsWith(inputValue.toLowerCase())))
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem)
        setInputValue('')
      }
    }
  })
  return (
    <>
      <FilterComboboxToggle {...getToggleButtonProps()}>
        <Icon icon={icon} />
        <SearchFilterCategoryLabel>{startCase(filterKey)}</SearchFilterCategoryLabel>
        {currentFilters.length > 0 && (
          <SearchFilterListCurrent>
            {currentFilters.map((f) => (
              <SearchFilterStyled
                selected
                key={`current_f_${f.id}`}
                onClick={() => {
                  removeCurrentFilter(f)
                  // updateResults()
                }}
              >
                {f.icon ? <IconDisplay icon={f.icon} /> : null}
                {f.label}
                {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
              </SearchFilterStyled>
            ))}
          </SearchFilterListCurrent>
        )}
      </FilterComboboxToggle>
      <StyledCombobox {...getComboboxProps()}>
        <SearchFilterInputWrapper isOverlay>
          <Input
            {...getInputProps()}
            onFocus={() => openMenu()}
            placeholder={placeholder ?? `Apply Filter...`}
            className={`FilterInput`}
          />
          <StyledMenu {...getMenuProps()} isOpen={isOpen} isOverlay>
            {isOpen &&
              inputItems.map((item, index) => (
                <Suggestion
                  highlight={highlightedIndex === index}
                  key={`${item.label}_${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.key === 'tag' && '#'} {item.label}
                </Suggestion>
              ))}
          </StyledMenu>
        </SearchFilterInputWrapper>
      </StyledCombobox>
    </>
  )
}

export default SearchFilterInput
