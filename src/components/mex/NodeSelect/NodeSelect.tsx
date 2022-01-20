import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import addCircleLine from '@iconify-icons/ri/add-circle-line'
import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useLinks } from '../../../hooks/useLinks'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import { withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { convertContentToRawText } from '../../../utils/Search/localSearch'
import { Input } from '../../../style/Form'
import {
  StyledCombobox,
  StyledMenu,
  Suggestion,
  SuggestionContentWrapper,
  SuggestionText,
  SuggestionDesc,
  StyledInputWrapper
} from './NodeSelect.styles'

export type ComboItem = {
  text: string
  value: string
  type: string
  uid?: string
}

interface NodeSelectProps {
  handleSelectItem: (nodeId: string) => void
  handleCreateItem?: (nodeId: string) => void
  id?: string
  name?: string
  disabled?: boolean
  inputRef?: any
  prefillRecent?: boolean
  menuOpen?: boolean
  autoFocus?: boolean
  defaultValue?: string | undefined
  placeholder?: string

  /** Show icon highlight for whether an option has been selected */
  highlightWhenSelected?: boolean

  /** Which highlight to show, true for selected (check) */
  iconHighlight?: boolean

  /** Add the create option at the top of the suggestions */
  createAtTop?: boolean

  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

interface NodeSelectState {
  inputItems: ComboItem[]
  selectedItem: ComboItem | null
}

function NodeSelect({
  autoFocus,
  menuOpen,
  defaultValue,
  placeholder,
  disabled,
  highlightWhenSelected,
  iconHighlight,
  prefillRecent,
  handleSelectItem,
  handleCreateItem,
  createAtTop,
  onFocus,
  onBlur,
  id,
  name
}: NodeSelectProps) {
  const [nodeSelectState, setNodeSelectState] = useState<NodeSelectState>({
    inputItems: [],
    selectedItem: null
  })

  const setInputItems = (inputItems: ComboItem[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: ComboItem | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const { getNodeIdFromUid } = useLinks()

  const reset = () =>
    setNodeSelectState({
      inputItems: [],
      selectedItem: null
    })

  const ilinks = useDataStore((store) => store.ilinks).map((l) => ({
    text: l.text,
    value: l.text,
    type: 'exists',
    uid: l.uid
  }))

  const lastOpened = useRecentsStore((store) => store.lastOpened)

  const lastOpenedItems = Array.from(lastOpened)
    .reverse()
    .map((l) => {
      const nodeId = getNodeIdFromUid(l)
      return { text: nodeId, value: nodeId, type: 'exists', uid: l }
    })
    .filter((i) => i.text)

  const { inputItems, selectedItem } = nodeSelectState
  const contents = useContentStore((store) => store.contents)

  const getNewItems = (inputValue: string) => {
    // const newItems =  ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    if (inputValue !== '') {
      const newItems = fuzzySearch(ilinks, inputValue, { keys: ['text'] })
      if (handleCreateItem && inputValue !== '' && isNew(inputValue, ilinks)) {
        if (createAtTop) {
          newItems.unshift({ text: `Create new: ${inputValue}`, value: inputValue, type: 'new' })
        } else newItems.push({ text: `Create new: ${inputValue}`, value: inputValue, type: 'new' })
      }
      return newItems
    } else {
      return ilinks
    }
  }

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
    getItemProps,
    closeMenu,
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

  function handleSelectedItemChange({ selectedItem }: any) {
    if (selectedItem) {
      const { key, isChild } = withoutContinuousDelimiter(selectedItem.value)
      if (selectedItem.type === 'new' && key && !isChild) {
        setSelectedItem({ ...selectedItem, text: key, value: key })
        setInputValue(key)
        handleCreateItem(key)
      } else {
        setSelectedItem(selectedItem)
        setInputValue(selectedItem.value)
        handleSelectItem(selectedItem.value)
      }
    }
    closeMenu()
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
      closeMenu()
    }
  }

  const onInpChange = useDebouncedCallback((e) => {
    const newItems = getNewItems(e.target.value)
    setInputItems(newItems)
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      setInputItems(newItems)
      setInputValue(defaultValue)
      setSelectedItem({ text: defaultValue, value: defaultValue, type: 'exists' })
    } else {
      if (prefillRecent && lastOpenedItems.length > 0) {
        setInputItems(lastOpenedItems.filter((i) => i.text))
      } else {
        setInputItems(ilinks)
      }
    }
    return () => {
      reset()
    }
  }, [defaultValue])

  return (
    <>
      <StyledCombobox {...getComboboxProps()}>
        <Input
          disabled={disabled}
          {...getInputProps()}
          autoFocus={autoFocus}
          placeholder={placeholder}
          id={id}
          name={name}
          // defaultValue={defaultValue}
          onChange={(e) => {
            getInputProps().onChange(e)
            onInpChange(e)
          }}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
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
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          inputItems.map((item, index) => {
            let desc: undefined | string = undefined
            if (item.type !== 'new') {
              // const nodeId = getNodeIdFromUid()
              const content = contents[item.uid]
              if (content) desc = convertContentToRawText(content.content, ' ')
              if (desc === '') desc = undefined
            }
            // console.log({ desc, item })
            return (
              <Suggestion
                highlight={highlightedIndex === index}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <Icon width={24} icon={item.type === 'new' ? addCircleLine : fileList2Line} />
                <SuggestionContentWrapper>
                  <SuggestionText>{item.text}</SuggestionText>
                  {desc !== undefined && <SuggestionDesc>{desc}</SuggestionDesc>}
                </SuggestionContentWrapper>
              </Suggestion>
            )
          })}
      </StyledMenu>
    </>
  )
}

NodeSelect.defaultProps = {
  menuOpen: false,
  autoFocus: false,
  placeholder: 'Select Node',
  handleCreateItem: undefined,
  highlightWhenSelected: false,
  iconHighlight: false,
  prefillRecent: false
}

export function isNew(input: string, items: Array<ComboItem>): boolean {
  return items.filter((item) => item.text === input).length === 0
}

export default NodeSelect

export const WrappedNodeSelect = (props: NodeSelectProps) => (
  <StyledInputWrapper>
    <NodeSelect {...props} />
  </StyledInputWrapper>
)
