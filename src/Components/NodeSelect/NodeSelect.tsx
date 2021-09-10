import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import React, { useEffect, useState } from 'react'
import { useNavigationState } from '../../Hooks/useNavigation/useNavigation'
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

  prefillLast?: boolean
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
  prefillLast,
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

  const lastOpened = useNavigationState((store) => store.recents.lastOpened)

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
      if (highlightedItem && highlightedItem.value) {
        setInputValue(highlightedItem.value)
      }
    }
  })

  function handleSelectedItemChange ({ selectedItem }: any) {
    if (selectedItem) {
      setSelectedItem(selectedItem)
      setInputValue(selectedItem.value)
      if (selectedItem.type === 'new') {
        handleCreateItem(selectedItem.value)
      } else {
        handleSelectItem(selectedItem.value)
      }
    }
    toggleMenu()
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0 && selectedItem === null) {
        const defaultItem = inputItems[0]
        setInputValue(defaultItem.value)
        setSelectedItem(defaultItem)
        if (defaultItem.type === 'new') {
          handleCreateItem(defaultItem.value)
        } else {
          handleSelectItem(defaultItem.value)
        }
      }
      toggleMenu()
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
      setSelectedItem({ text: defaultValue, value: defaultValue, type: 'exists' })
    } else {
      if (prefillLast && lastOpened.length > 0) {
        setInputItems(
          Array.from(lastOpened)
            .reverse()
            .map((l) => ({
              text: l,
              value: l,
              type: 'exists'
            }))
        )
      } else {
        setInputItems(ilinks)
      }
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
          // defaultValue={defaultValue}
          onChange={(e) => {
            getInputProps().onChange(e)
            onInpChange(e)
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
  iconHighlight: false,
  prefillLast: false
}

function isNew (input: string, items: ComboItem[]): boolean {
  return !items.map((t) => t.text).includes(input)
}

export default NodeSelect
