import { useCombobox } from 'downshift'
import React, { useEffect } from 'react'
import create from 'zustand'
import useDataStore from '../../Editor/Store/DataStore'
import { Input } from '../../Styled/Form'
import { StyledCombobox, StyledInputWrapper, StyledMenu, Suggestion } from './NodeSelect.styles'

type ComboItem = {
  text: string
  value: string
  type: string
}

interface NodeSelectProps {
  handleSelectItem: (nodeId: string) => void
  handleCreateItem?: (nodeId: string) => void

  menuOpen?: boolean
  autoFocus?: boolean
  defaultValue?: string | undefined
  placeholder?: string
}

interface NodeSelectState {
  inputItems: ComboItem[]
  selectedItem: ComboItem | null

  setInputItems: (inputItems: ComboItem[]) => void
  setSelectedItem: (selectedItem: ComboItem | null) => void
  reset: () => void
}

const useNodeSelectStore = create<NodeSelectState>((set) => ({
  inputItems: [],
  selectedItem: null,

  setInputItems: (inputItems: ComboItem[]) => set({ inputItems }),

  setSelectedItem: (selectedItem: ComboItem | null) => set({ selectedItem }),

  reset: () =>
    set({
      inputItems: [],
      selectedItem: null
    })
}))

function NodeSelect ({
  autoFocus,
  menuOpen,
  defaultValue,
  placeholder,
  handleSelectItem,
  handleCreateItem
}: NodeSelectProps) {
  const ilinks = useDataStore((store) => store.ilinks).map((l) => ({
    text: l.key,
    value: l.key,
    type: 'exists'
  }))
  const inputItems = useNodeSelectStore((store) => store.inputItems)
  const setInputItems = useNodeSelectStore((store) => store.setInputItems)

  const selectedItem = useNodeSelectStore((store) => store.selectedItem)
  const setSelectedItem = useNodeSelectStore((store) => store.setSelectedItem)

  const reset = useNodeSelectStore((store) => store.reset)

  const getNewItems = (inputValue: string) => {
    const newItems = ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    if (handleCreateItem && inputValue !== '' && isNew(inputValue, ilinks)) {
      newItems.push({ text: `Create new: ${inputValue}`, value: inputValue, type: 'new' })
    }
    return newItems
  }

  const {
    isOpen,
    // getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
    getItemProps,
    toggleMenu
  } = useCombobox({
    items: inputItems,
    selectedItem,
    initialIsOpen: menuOpen,
    onSelectedItemChange: handleSelectedItemChange,
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      const highlightedItem = inputItems[highlightedIndex]
      if (highlightedItem && highlightedItem.value && highlightedItem.type !== 'new') {
        setInputValue(highlightedItem.value)
      }
    }
  })

  function handleSelectedItemChange ({ selectedItem }: any) {
    if (selectedItem.type === 'new') {
      handleCreateItem(selectedItem.value)
    } else {
      handleSelectItem(selectedItem.value)
    }
    setSelectedItem(selectedItem.value)
    toggleMenu()
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0) {
        const defaultItem = inputItems[0]
        if (defaultItem.type === 'new') {
          handleCreateItem(defaultItem.value)
        } else {
          handleSelectItem(defaultItem.value)
        }
        toggleMenu()
      }
    }
  }

  const onInpChange = (e) => {
    const newItems = getNewItems(e.target.value)
    setInputItems(newItems)
  }

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      setInputItems(newItems)
      setInputValue(defaultValue)
    } else {
      setInputItems(ilinks)
    }
    return () => {
      reset()
    }
  }, [])

  return (
    <StyledInputWrapper>
      <StyledCombobox {...getComboboxProps()}>
        <Input
          {...getInputProps()}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={(e) => {
            onInpChange(e)
            getInputProps().onChange(e)
          }}
          onKeyUp={onKeyUp}
        />
        {/*
        Open lookup button
        <button type="button" {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button> */}
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} highlightFirst={highlightedIndex < 0} isOpen={isOpen}>
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

NodeSelect.defaultProps = {
  menuOpen: false,
  autoFocus: false,
  placeholder: 'Select Node',
  handleCreateItem: undefined
}

function isNew (input: string, items: ComboItem[]): boolean {
  return !items.map((t) => t.text).includes(input)
}

export default NodeSelect
