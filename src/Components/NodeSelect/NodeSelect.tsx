import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import React, { useEffect, useState } from 'react'
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
  highlightWhenSelected?: boolean
  iconHighlight?: boolean
}

interface NodeSelectState {
  inputItems: ComboItem[]
  selectedItem: ComboItem | null
}

function NodeSelect ({
  autoFocus,
  menuOpen,
  defaultValue,
  placeholder,
  highlightWhenSelected,
  iconHighlight,
  handleSelectItem,
  handleCreateItem
}: NodeSelectProps) {
  const [nodeSelectState, setNodeSelectState] = useState<NodeSelectState>({
    inputItems: [],
    selectedItem: null
  })

  const setInputItems = (inputItems: ComboItem[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: ComboItem | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const reset = () =>
    setNodeSelectState({
      inputItems: [],
      selectedItem: null
    })

  const ilinks = useDataStore((store) => store.ilinks).map((l) => ({
    text: l.key,
    value: l.key,
    type: 'exists'
  }))

  const { inputItems, selectedItem } = nodeSelectState

  const getNewItems = (inputValue: string) => {
    const newItems = ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    if (handleCreateItem && inputValue !== '' && isNew(inputValue, ilinks)) {
      newItems.push({ text: `Create new: ${inputValue}`, value: inputValue, type: 'new' })
    }
    return newItems
  }

  const {
    isOpen,
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
    itemToString: (item) => {
      return item ? item.value : ''
    },
    onSelectedItemChange: handleSelectedItemChange,
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      const highlightedItem = inputItems[highlightedIndex]
      if (highlightedItem && highlightedItem.value && highlightedItem.type !== 'new') {
        setInputValue(highlightedItem.value)
      }
    }
  })

  function handleSelectedItemChange ({ selectedItem }: any) {
    if (selectedItem) {
      if (selectedItem.type === 'new') {
        handleCreateItem(selectedItem.value)
      } else {
        handleSelectItem(selectedItem.value)
      }
      setSelectedItem(selectedItem)
      setInputValue(selectedItem.value)
    }
    toggleMenu()
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0) {
        const defaultItem = inputItems[0]
        setSelectedItem(defaultItem)
        if (defaultItem.type === 'new') {
          handleCreateItem(defaultItem.value)
        } else {
          handleSelectItem(defaultItem.value)
        }
        setInputValue(defaultItem.value)
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

  // console.log({ selectedItem })

  return (
    <StyledInputWrapper>
      <StyledCombobox {...getComboboxProps()}>
        <Input
          {...getInputProps()}
          autoFocus={autoFocus}
          placeholder={placeholder}
          // defaultValue={defaultValue}
          onChange={(e) => {
            onInpChange(e)
            getInputProps().onChange(e)
          }}
          onKeyUp={onKeyUp}
        />
        {highlightWhenSelected &&
          (iconHighlight ? (
            <Icon className="okayIcon" icon={checkboxCircleLine}></Icon>
          ) : (
            <Icon className="errorIcon" icon={errorWarningLine}></Icon>
          ))}
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
  handleCreateItem: undefined,
  highlightWhenSelected: false,
  iconHighlight: false
}

function isNew (input: string, items: ComboItem[]): boolean {
  return !items.map((t) => t.text).includes(input)
}

export default NodeSelect
