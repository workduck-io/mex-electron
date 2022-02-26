import React, { useEffect, useState } from 'react'
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
import { isClash, isReserved } from '../../../utils/lib/paths'
import { mog, withoutContinuousDelimiter } from '../../../utils/lib/helper'

import { ILink } from '../../../types/Types'
import { Icon } from '@iconify/react'
import { Input } from '../../../style/Form'
import addCircleLine from '@iconify-icons/ri/add-circle-line'
import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import lock2Line from '@iconify-icons/ri/lock-2-line'
import toast from 'react-hot-toast'
import { useCombobox } from 'downshift'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
// import { MexIcon } from '../../../style/Layouts'
import { useDebouncedCallback } from 'use-debounce'
import { useLinks } from '../../../hooks/useLinks'
import { useRecentsStore } from '../../../store/useRecentsStore'

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

  /** disallow input if clash */
  disallowClash?: boolean

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
  clash: boolean
}
interface ReserveClashActionProps {
  path: string
  onReserve: (reserve: boolean) => void
  onClash: (clash: boolean) => void
  onSuccess: () => void
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
  disallowClash,
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
    reserved: false,
    clash: false
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
      reserved: false,
      clash: false
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
    // mog('Slelected', { inputValue })
    if (inputValue !== '') {
      const newItems = fuzzySearch(ilinks, inputValue, { keys: ['text'] })
      if (
        !isClash(
          inputValue,
          ilinks.map((l) => l.value)
        )
      ) {
        if (handleCreateItem && isNew(inputValue, ilinks) && !isReserved(inputValue)) {
          const comboItem = createNewComboItem(inputValue)
          if (createAtTop) {
            newItems.unshift(comboItem)
          } else newItems.push(comboItem)
        }
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
      mog('Handling the selected item change', { selectedItem, key, isChild })
      onReverseClashAction({
        path: key,
        onSuccess: () => {
          if (selectedItem.type === 'new' && key && !isChild) {
            setSelectedItem({ ...selectedItem, text: key, value: key })
            setInputValue(key)
            handleCreateItem(key)
          } else {
            setSelectedItem(selectedItem)
            setInputValue(selectedItem.value)
            handleSelectItem(selectedItem.value)
          }
          closeMenu()
        },
        onReserve: () => {
          setInputValue(key)
          toast('Reserve node cannot be used')
        },
        onClash: () => {
          setInputValue(key)
          toast('Existing node cannot be used')
        }
      })
    }
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0 && selectedItem === null && isOpen) {
        const defaultItem = inputItems[0]
        onReverseClashAction({
          path: defaultItem.value,
          onSuccess: () => {
            setInputValue(defaultItem.value)
            setSelectedItem(defaultItem)
            if (defaultItem.type === 'new') {
              handleCreateItem(defaultItem.value)
            } else {
              handleSelectItem(defaultItem.value)
            }
            closeMenu()
          },
          onReserve: () => {
            toast('Reserve node cannot be used')
          },
          onClash: () => {
            toast('Existing node cannot be used')
          }
        })
      }
    }
  }

  const onReverseClashAction = ({ path, onReserve, onClash, onSuccess }: ReserveClashActionProps) => {
    const reserved = isReserved(path)
    const clash = isClash(
      path,
      ilinks.map((i) => i.value)
    )

    // Update if search is reserved/clash, or when reserved/clash is true
    if (
      ((reserved || nodeSelectState.reserved) && disallowReserved) ||
      ((clash || nodeSelectState.clash) && disallowClash)
    ) {
      if ((reserved || nodeSelectState.reserved) && disallowReserved) {
        onReserve(reserved)
      } else if ((clash || nodeSelectState.clash) && disallowClash) {
        onClash(clash)
      }
    } else {
      onSuccess()
    }
  }

  const onInpChange = useDebouncedCallback((e) => {
    const search = e.target.value
    const newItems = getNewItems(search)

    // mog('onInpChange', { search, newItems })

    // Update if search is reserved/clash, or when reserved is true
    onReverseClashAction({
      path: search,
      onSuccess: () => {
        setInputItems(newItems)
      },
      onReserve: (reserved) => {
        setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
      },
      onClash: (clash) => {
        setNodeSelectState({ ...nodeSelectState, inputItems, clash })
      }
    })
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      const nodeid = getUidFromNodeId(defaultValue)
      onReverseClashAction({
        path: defaultValue,
        onSuccess: () => {
          setInputItems(newItems)
          setInputValue(defaultValue)
          setSelectedItem(createComboItem(defaultValue, nodeid))
        },
        onReserve: (reserved) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
          setInputValue(defaultValue)
        },
        onClash: (clash) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, clash })
          setInputValue(defaultValue)
        }
      })
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
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {disallowReserved && nodeSelectState.reserved ? (
          <SuggestionError>
            <Icon width={24} icon={lock2Line} />
            {nodeSelectState.reserved && (
              <SuggestionContentWrapper>
                <SuggestionText>Warning: Reserved Node</SuggestionText>
                <SuggestionDesc>Reserved Nodes cannot be used!</SuggestionDesc>
                <SuggestionDesc>However, Children inside reserved nodes can be used.</SuggestionDesc>
              </SuggestionContentWrapper>
            )}
          </SuggestionError>
        ) : (
          <>
            {isOpen &&
              inputItems.map((item, index) => {
                let desc: undefined | string = undefined
                if (item.type !== 'new') {
                  const content = contents[item.nodeid]
                  if (content) desc = convertContentToRawText(content.content, ' ')
                  if (desc === '') desc = undefined
                }
                const icon = item.icon ? item.icon : fileList2Line
                if (nodeSelectState.clash && disallowClash && item.type === 'new') return null
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
              })}
          </>
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
