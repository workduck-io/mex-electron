import addCircleLine from '@iconify-icons/ri/add-circle-line'
import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import React, { useEffect, useState } from 'react'
// import { MexIcon } from '../../../style/Layouts'
import { useDebouncedCallback } from 'use-debounce'
import { useLinks } from '../../../hooks/useLinks'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { Input } from '../../../style/Form'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import { withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import lock2Line from '@iconify-icons/ri/lock-2-line'
import {
  StyledCombobox,
  StyledInputWrapper,
  StyledMenu,
  Suggestion,
  SuggestionContentWrapper,
  SuggestionDesc,
  SuggestionError,
  SuggestionText
} from './NodeSelect.styles'
import MexIcons from '../../../components/icons/Icons'
import { ILink } from '../../../types/Types'
import { isReserved } from '../../../utils/lib/paths'

export type ComboItem = {
  // Text to be shown in the combobox list
  text: string

  // Value of the item. In this case NodeId
  value: string

  // Does it 'exist' or is it 'new'
  type: string

  // Unique identifier
  // Not present if the node is not yet created i.e. 'new'
  nodeid?: string

  icon?: string
}

export const createComboItem = (path: string, nodeid: string, icon?: string): ComboItem => ({
  text: path,
  value: path,
  type: 'exists',
  nodeid,
  icon
})

export const createNewComboItem = (path: string): ComboItem => ({
  text: `Create new: ${path}`,
  value: path,
  type: 'new'
})

interface NodeSelectProps {
  handleSelectItem: (path: string) => void
  handleCreateItem?: (path: string) => void
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

  /** disallow input if reserved */
  disallowReserved?: boolean

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
  reserved: boolean
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
  disallowReserved,
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
    selectedItem: null,
    reserved: false
  })

  const setInputItems = (inputItems: ComboItem[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: ComboItem | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const { getNodeIdFromUid, getUidFromNodeId } = useLinks()

  const getILinks = () => {
    const rawLinks = useDataStore.getState().ilinks
    if (!disallowReserved) return rawLinks.map((l) => createComboItem(l.path, l.nodeid, l.icon))
    const fLinks = rawLinks.filter((l) => !isReserved(l.path))
    return fLinks.map((l) => createComboItem(l.path, l.nodeid, l.icon))
  }

  const reset = () =>
    setNodeSelectState({
      inputItems: [],
      selectedItem: null,
      reserved: false
    })

  const ilinks = getILinks()

  const lastOpened = useRecentsStore((store) => store.lastOpened)

  const lastOpenedItems = Array.from(lastOpened)
    .reverse()
    .map((nodeid) => {
      const path = getNodeIdFromUid(nodeid)
      return createComboItem(path, nodeid)
    })
    .filter((i) => i.text)

  const { inputItems, selectedItem } = nodeSelectState
  const contents = useContentStore((store) => store.contents)

  const getNewItems = (inputValue: string) => {
    // const newItems =  ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    if (inputValue !== '') {
      const newItems = fuzzySearch(ilinks, inputValue, { keys: ['text'] })
      if (handleCreateItem && inputValue !== '' && isNew(inputValue, ilinks) && !isReserved(inputValue)) {
        const comboItem = createNewComboItem(inputValue)
        if (createAtTop) {
          newItems.unshift(comboItem)
        } else newItems.push(comboItem)
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
    closeMenu
    // toggleMenu
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
    const search = e.target.value
    if (disallowReserved) {
      const reserved = isReserved(search)
      // Update if search is reserved/clash, or when reserved is true
      if (reserved || nodeSelectState.reserved) {
        setNodeSelectState({ ...nodeSelectState, reserved })
      }
    }
    const newItems = getNewItems(e.target.value)
    setInputItems(newItems)
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      const nodeid = getUidFromNodeId(defaultValue)
      setInputItems(newItems)
      setInputValue(defaultValue)
      setSelectedItem(createComboItem(defaultValue, nodeid))
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
        {nodeSelectState.reserved ? (
          <SuggestionError>
            <Icon width={24} icon={lock2Line} />
            <SuggestionContentWrapper>
              <SuggestionText>Warning: Reserved Node</SuggestionText>
              <SuggestionDesc>Reserved Nodes cannot be used!</SuggestionDesc>
              <SuggestionDesc>However, Children inside reserved nodes can be used.</SuggestionDesc>
            </SuggestionContentWrapper>
          </SuggestionError>
        ) : (
          isOpen &&
          inputItems.map((item, index) => {
            let desc: undefined | string = undefined
            if (item.type !== 'new') {
              // const path = getNodeIdFromUid()
              const content = contents[item.nodeid]
              if (content) desc = convertContentToRawText(content.content, ' ')
              if (desc === '') desc = undefined
            }
            // console.log({ desc, item })
            const icon = item.icon ? item.icon : fileList2Line
            return (
              <Suggestion
                highlight={highlightedIndex === index}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <Icon width={24} icon={item.type === 'new' ? addCircleLine : icon} />
                <SuggestionContentWrapper>
                  <SuggestionText>{item.text}</SuggestionText>
                  {desc !== undefined && <SuggestionDesc>{desc}</SuggestionDesc>}
                </SuggestionContentWrapper>
              </Suggestion>
            )
          })
        )}
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

export const isNewILink = (input: string, items: Array<ILink>): boolean => {
  return items.filter((item) => item.path == input).length === 0
}

export default NodeSelect

export const WrappedNodeSelect = (props: NodeSelectProps) => (
  <StyledInputWrapper>
    <NodeSelect {...props} />
  </StyledInputWrapper>
)
