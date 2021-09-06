import React, { useState } from 'react'
import { useCombobox } from 'downshift'
import { StyledCombobox, StyledInputWrapper, StyledMenu, Suggestion } from './NodeSelect.styles'
import { Input } from '../../Styled/Form'
import useDataStore from '../../Editor/Store/DataStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
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

interface NodeSelectProps {
  handleSelectItem: (nodeId: string) => void
}

export function NodeSelect ({ handleSelectItem }: NodeSelectProps) {
  const items = useDataStore((store) => store.ilinks).map((t) => t.text)
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const [inputItems, setInputItems] = useState(items)
  const [selectedItem, setSelectedItem] = useState(null)

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    toggleMenu
  } = useCombobox({
    items: inputItems,
    selectedItem,
    initialIsOpen: true,
    onSelectedItemChange: handleSelectedItemChange,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(items.filter((item) => item.toLowerCase().startsWith(inputValue.toLowerCase())))
    }
  })

  console.log({ menuProps: getMenuProps() })

  function handleSelectedItemChange ({ selectedItem }: any) {
    console.log({ selectedItem })
    setSelectedItem(selectedItem)
    loadNodeFromId(selectedItem)
    handleSelectItem(selectedItem)
    toggleMenu()
  }

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
