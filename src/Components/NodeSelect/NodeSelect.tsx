import React, { useEffect, useState } from 'react'
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

type ComboItem = {
  text: string
  value: string
}

interface NodeSelectProps {
  handleSelectItem: (nodeId: string) => void
}

export function NodeSelect ({ handleSelectItem }: NodeSelectProps) {
  const ilinks = useDataStore((store) => store.ilinks)
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)

  // Items to display in the combobox suggestions
  const [inputItems, setInputItems] = useState(ilinks)
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
      const newItems = ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
      if (isNew(inputValue, ilinks)) {
        console.log('isnew', { inputValue })

        newItems.push({ text: `Create new: ${inputValue}`, value: inputValue, key: '__create_new' })
      }
      setInputItems(newItems)
    }
  })

  console.log('ComboMain', { ilinks })

  function handleSelectedItemChange ({ selectedItem }: any) {
    console.log({ selectedItem })
    setSelectedItem(selectedItem)
    loadNodeFromId(selectedItem.value)
    handleSelectItem(selectedItem.value)
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
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.text}
              </Suggestion>
            )
          })}
      </StyledMenu>
    </StyledInputWrapper>
  )
}

function isNew (input: string, items: ComboItem[]): boolean {
  return !items.map((t) => t.text).includes(input)
}
