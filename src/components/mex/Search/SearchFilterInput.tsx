import { useCombobox } from 'downshift'
import React, { useState } from 'react'
import { SearchFilter } from '../../../hooks/useFilters'
import { Input } from '../../../style/Form'
import { SearchFilterInputWrapper } from '../../../style/Search'
import { StyledCombobox, Suggestion, StyledMenu, StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'

interface SearchFilterInputProps<Item> {
  items: SearchFilter<Item>[]
  onChange: (item: SearchFilter<Item>) => void
}
const SearchFilterInput = <Item,>({ items, onChange }: SearchFilterInputProps<Item>) => {
  const [inputItems, setInputItems] = useState(items)
  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
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
    <SearchFilterInputWrapper>
      <StyledCombobox {...getComboboxProps()}>
        <Input {...getInputProps()} className={`FilterInput`} />
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          inputItems.map((item, index) => (
            <Suggestion
              highlight={highlightedIndex === index}
              key={`${item.label}_${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </Suggestion>
          ))}
      </StyledMenu>
    </SearchFilterInputWrapper>
  )
}

export default SearchFilterInput
