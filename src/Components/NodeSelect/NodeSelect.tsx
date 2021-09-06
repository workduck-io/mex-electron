import React, { useState } from 'react'
import { useCombobox } from 'downshift'
import { StyledCombobox, StyledInputWrapper, StyledMenu, Suggestion } from './NodeSelect.styles'
import { Input } from '../../Styled/Form'
// import {items, menuStyles, comboboxStyles} from '../../shared'

function stateReducer (state, actionAndChanges) {
  const { type, changes } = actionAndChanges
  // returning an uppercased version of the item string.
  switch (type) {
    case useCombobox.stateChangeTypes.InputChange:
      return {
        // return normal changes.
        ...changes,
        // but taking the change from default reducer and uppercasing it.
        inputValue: changes.inputValue.toUpperCase()
      }
    // also on selection.
    case useCombobox.stateChangeTypes.ItemClick:
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.InputBlur:
      return {
        ...changes,
        // if we had an item selected.
        ...(changes.selectedItem && {
          // we will show it uppercased.
          inputValue: changes.inputValue.toUpperCase()
        })
      }
    default:
      return changes // otherwise business as usual.
  }
}

export function NodeSelect () {
  const items = [
    'Neptunium',
    'Plutonium',
    'Americium',
    'Curium',
    'Berkelium',
    'Californium',
    'Einsteinium',
    'Fermium',
    'Mendelevium',
    'Nobelium',
    'Lawrencium',
    'Rutherfordium',
    'Dubnium',
    'Seaborgium',
    'Bohrium',
    'Hassium',
    'Meitnerium',
    'Darmstadtium',
    'Roentgenium',
    'Copernicium',
    'Nihonium',
    'Flerovium',
    'Moscovium',
    'Livermorium',
    'Tennessine',
    'Oganesson'
  ]
  const [inputItems, setInputItems] = useState(items)
  const [selectedItem, setSelectedItem] = useState(null)

  function handleSelectedItemChange ({ selectedItem }: any) {
    setSelectedItem(selectedItem)
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items: inputItems,
    selectedItem,
    onSelectedItemChange: handleSelectedItemChange,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(items.filter((item) => item.toLowerCase().startsWith(inputValue.toLowerCase())))
    }
  })
  console.log({ menuProps: getMenuProps() })

  return (
    <StyledInputWrapper>
      {/* <label {...getLabelProps()}>Choose an element:</label> */}
      <StyledCombobox {...getComboboxProps()}>
        <Input {...getInputProps()} />
        <button type="button" {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button>
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          inputItems.map((item, index) => {
            return (
              <Suggestion
                highlight={highlightedIndex === index}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </Suggestion>
            )
          })}
      </StyledMenu>
    </StyledInputWrapper>
  )
}
