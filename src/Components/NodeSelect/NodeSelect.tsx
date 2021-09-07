import { useCombobox } from 'downshift'
import React, { useEffect } from 'react'
import create from 'zustand'
import useDataStore from '../../Editor/Store/DataStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Input } from '../../Styled/Form'
import { StyledCombobox, StyledInputWrapper, StyledMenu, Suggestion } from './NodeSelect.styles'

type ComboItem = {
  text: string
  value: string
}

interface NodeSelectProps {
  handleSelectItem: (nodeId: string) => void
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

export function NodeSelect ({ handleSelectItem }: NodeSelectProps) {
  const ilinks = useDataStore((store) => store.ilinks).map((l) => ({
    text: l.key,
    value: l.key
  }))
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)

  const inputItems = useNodeSelectStore((store) => store.inputItems)
  const setInputItems = useNodeSelectStore((store) => store.setInputItems)

  const selectedItem = useNodeSelectStore((store) => store.selectedItem)
  const setSelectedItem = useNodeSelectStore((store) => store.setSelectedItem)

  const reset = useNodeSelectStore((store) => store.reset)

  const getNewItems = (inputValue: string) => {
    const newItems = ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    if (inputValue !== '' && isNew(inputValue, ilinks)) {
      newItems.push({ text: `Create new: ${inputValue}`, value: inputValue })
    }
    return newItems
  }

  const {
    isOpen,
    getToggleButtonProps,
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
    initialIsOpen: true,
    onSelectedItemChange: handleSelectedItemChange,
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      const highlightedItem = inputItems[highlightedIndex]
      if (highlightedItem && highlightedItem.value && highlightedItem.value !== '__create_new') {
        setInputValue(highlightedItem.value)
      }
    }
  })

  function handleSelectedItemChange ({ selectedItem }: any) {
    // console.log({ selectedItem })
    setSelectedItem(selectedItem.value)
    loadNodeFromId(selectedItem.value)
    handleSelectItem(selectedItem.value)
    toggleMenu()
  }

  const onInpChange = (e) => {
    // console.log(e)
    const newItems = getNewItems(e.target.value)
    setInputItems(newItems)
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0) {
        handleSelectItem(inputItems[0].value)
      }
    }
  }
  useEffect(() => {
    setInputItems(ilinks)
    return () => {
      reset()
    }
  }, [])

  return (
    <StyledInputWrapper>
      <StyledCombobox {...getComboboxProps()}>
        <Input
          {...getInputProps()}
          onChange={(e) => {
            onInpChange(e)
            getInputProps().onChange(e)
          }}
          onKeyUp={onKeyUp}
        />
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
