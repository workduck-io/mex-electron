import React, { useEffect, useMemo, useState } from 'react'

import { useSearchExtra } from '@hooks/useSearch'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import checkboxCircleLine from '@iconify/icons-ri/checkbox-circle-line'
import errorWarningLine from '@iconify/icons-ri/error-warning-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import lock2Line from '@iconify/icons-ri/lock-2-line'
import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import toast from 'react-hot-toast'
// import { MexIcon } from '../../../style/Layouts'
import { useDebouncedCallback } from 'use-debounce'

import { useLinks } from '../../../hooks/useLinks'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { Input } from '../../../style/Form'
import { ILink } from '../../../types/Types'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import { mog, withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { isClash, isReserved } from '../../../utils/lib/paths'
import { convertContentToRawText } from '../../../utils/search/parseData'
import { SEPARATOR } from '../Sidebar/treeUtils'
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

export type QuickLink = {
  // Text to be shown in the combobox list
  text: string

  // Value of the item. In this case NodeId
  value: string

  // Does it 'exist' or is it QuickLinkStatus.new
  status: QuickLinkStatus

  type?: QuickLinkType

  // Unique identifier
  // Not present if the node is not yet created i.e. QuickLinkStatus.new
  nodeid?: string

  icon?: string
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  snippet = 'Snippets',
  flow = 'Flows',
  tags = 'Tags',
  mentions = 'Mentions'
}

enum QuickLinkStatus {
  new,
  exists
}

export const makeQuickLink = (
  title: string,
  options: { nodeid: string; type?: QuickLinkType; icon?: string }
): QuickLink => ({
  text: title,
  value: title,
  type: options.type ?? QuickLinkType.backlink,
  status: QuickLinkStatus.exists,
  nodeid: options.nodeid,
  icon: options.icon
})

export const createNewQuickLink = (path: string, type: QuickLinkType = QuickLinkType.backlink): QuickLink => ({
  text: `Create new: ${path}`,
  value: path,
  type,
  status: QuickLinkStatus.new
})

interface NodeSelectProps {
  handleSelectItem: (item: QuickLink) => void
  handleCreateItem?: (item: QuickLink) => void
  id?: string
  name?: string
  disabled?: boolean
  inputRef?: any
  showAll?: boolean
  prefillRecent?: boolean
  menuOpen?: boolean
  /** If true, the combobox will be autofocused */
  autoFocus?: boolean
  /** If true, when autofocused, all text will be selected */
  autoFocusSelectAll?: boolean

  defaultValue?: string | undefined
  placeholder?: string

  /** Show icon highlig‸ht for whether an option has been selected */
  highlightWhenSelected?: boolean

  /** disallow input if reserved */
  disallowReserved?: boolean

  /** disallow input if clash */
  disallowClash?: boolean

  /** disallow input if match  */
  disallowMatch?: (path: string) => boolean

  /** Which highlight to show, true for selected (check) */
  iconHighlight?: boolean

  /** Add the create option at the top of the suggestions */
  createAtTop?: boolean

  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

interface NodeSelectState {
  inputItems: QuickLink[]
  selectedItem: QuickLink | null
  reserved: boolean
  clash: boolean
  isMatch: boolean
}
interface ReserveClashActionProps {
  path: string
  onReserve: (reserve: boolean) => void
  onClash: (clash: boolean) => void
  onMatch: (isMatch: boolean) => void
  onSuccess: () => void
}

function NodeSelect({
  autoFocus,
  autoFocusSelectAll,
  menuOpen,
  defaultValue,
  placeholder,
  showAll,
  disabled,
  highlightWhenSelected,
  iconHighlight,
  prefillRecent,
  disallowMatch,
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
    clash: false,
    isMatch: false
  })

  const { getSearchExtra } = useSearchExtra()

  const setInputItems = (inputItems: QuickLink[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: QuickLink | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const { getPathFromNodeid, getNodeidFromPath } = useLinks()

  const getQuickLinks = () => {
    const ilinks = useDataStore.getState().ilinks
    const snippets = useSnippetStore.getState().snippets
    const sharedNodes = useDataStore.getState().sharedNodes

    // if (!disallowReserved) {
    //   return ilinks.map((l) => makeQuickLink(l.path, { nodeid: l.nodeid, icon: l.icon }))
    // }

    const fLinks = disallowReserved ? ilinks.filter((l) => !isReserved(l.path)) : ilinks

    const mLinks = fLinks.map((l) => makeQuickLink(l.path, { nodeid: l.nodeid, icon: l.icon }))

    const sLinks = sharedNodes.map((l) => makeQuickLink(l.path, { nodeid: l.nodeid, icon: 'ri:share-line' }))

    if (!showAll) return mLinks

    const mSnippets = snippets.map((s) =>
      makeQuickLink(s.title, { nodeid: s.id, type: QuickLinkType.snippet, icon: s.icon })
    )

    return [...mLinks, ...sLinks, ...mSnippets]
  }

  const reset = () =>
    setNodeSelectState({
      inputItems: [],
      selectedItem: null,
      reserved: false,
      clash: false,
      isMatch: false
    })

  const quickLinks = getQuickLinks()

  const lastOpened = useRecentsStore((store) => store.lastOpened)

  const lastOpenedItems = Array.from(lastOpened)
    .reverse()
    .map((nodeid) => {
      const path = getPathFromNodeid(nodeid)
      return makeQuickLink(path, { nodeid })
    })
    .filter((i) => i.text)

  const { inputItems, selectedItem } = nodeSelectState
  const searchExtra = useMemo(() => getSearchExtra(), [])
  const contents = useContentStore((store) => store.contents)

  const getNewItems = (inputValue: string) => {
    // const newItems =  ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    // mog('Slelected', { inputValue })

    if (inputValue !== '') {
      const newItems = fuzzySearch(quickLinks, inputValue, (item) => item.text)
      if (
        !isClash(
          inputValue,
          quickLinks.map((l) => l.value)
        )
      ) {
        if (handleCreateItem && isNew(inputValue, quickLinks) && !isReserved(inputValue)) {
          const comboItem = createNewQuickLink(inputValue)
          if (createAtTop) {
            newItems.unshift(comboItem)
          } else newItems.push(comboItem)
        }
      }
      return newItems
    } else {
      return quickLinks
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

  function handleSelectedItemChange({ selectedItem }: { selectedItem?: QuickLink }) {
    if (selectedItem) {
      const { key, isChild } = withoutContinuousDelimiter(selectedItem.value)

      if (key === '') return
      if (isChild) return

      onReverseClashAction({
        path: key,
        onSuccess: () => {
          if (selectedItem.status === QuickLinkStatus.new && key && !isChild) {
            setSelectedItem({ ...selectedItem, text: key, value: key })
            setInputValue(key)
            handleCreateItem({ ...selectedItem, text: key, value: key })
          } else {
            setSelectedItem(selectedItem)
            setInputValue(selectedItem.value)
            handleSelectItem(selectedItem)
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
        },
        onMatch: () => {
          setInputValue(key)
          toast('Note itself cannot be used')
        }
      })
    }
  }

  const onFocusWithSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    // mog('Focusing with select all1', { e, autoFocus })
    const timoutId = setTimeout(() => {
      if (autoFocus && autoFocusSelectAll) {
        // mog('Focusing with select all', { e, autoFocus })
        e.target.focus()
        e.target.select()
        e.target.setSelectionRange(0, e.target.value.length)
      }
    }, 300)
    onFocus && onFocus(e)
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0 && selectedItem === null && isOpen) {
        const quickLink: QuickLink = inputItems[0]
        onReverseClashAction({
          path: quickLink.value,
          onSuccess: () => {
            setInputValue(quickLink.value)
            setSelectedItem(quickLink)
            if (quickLink.status === QuickLinkStatus.new) {
              handleCreateItem(quickLink)
            } else {
              handleSelectItem(quickLink)
            }
            closeMenu()
          },
          onReserve: () => {
            toast('Reserve node cannot be used')
            setInputValue('')
          },
          onClash: () => {
            toast('Existing node cannot be used')
            setInputValue('')
          },
          onMatch: () => {
            toast('Note itself cannot be used')
            setInputValue('')
          }
        })
      }
    }
  }

  const onReverseClashAction = ({ path, onReserve, onClash, onSuccess, onMatch }: ReserveClashActionProps) => {
    const reserved = isReserved(path)
    const clash = isClash(
      path,
      quickLinks.map((i) => i.value)
    )

    const match = typeof disallowMatch === 'function' && disallowMatch(path)

    mog('MATCH', { match })

    // Update if search is reserved/clash, or when reserved/clash is true
    if (
      ((reserved || nodeSelectState.reserved) && disallowReserved) ||
      ((clash || nodeSelectState.clash) && disallowClash) ||
      match ||
      nodeSelectState.isMatch
    ) {
      if (match || nodeSelectState.isMatch) {
        onMatch(match)
      } else if ((reserved || nodeSelectState.reserved) && disallowReserved) {
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
      },
      onMatch: (isMatch) => {
        setNodeSelectState({ ...nodeSelectState, inputItems: newItems, isMatch })
      }
    })
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      const nodeid = getNodeidFromPath(defaultValue)
      onReverseClashAction({
        path: defaultValue,
        onSuccess: () => {
          setInputItems(newItems)
          setInputValue(defaultValue)
          setSelectedItem(makeQuickLink(defaultValue, { nodeid }))
        },
        onReserve: (reserved) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
          setInputValue(defaultValue)
        },
        onClash: (clash) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, clash })
          setInputValue(defaultValue)
        },
        onMatch: (isMatch) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, isMatch })
          setInputValue(defaultValue)
        }
      })
    } else {
      if (prefillRecent && lastOpenedItems.length > 0) {
        setInputItems(lastOpenedItems.filter((i) => i.text))
      } else {
        setInputItems(quickLinks)
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
          onFocus={onFocusWithSelect}
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
                <SuggestionText>Warning: Reserved Note</SuggestionText>
                <SuggestionDesc>Reserved Notes cannot be used!</SuggestionDesc>
                <SuggestionDesc>However, Children inside reserved notes can be used.</SuggestionDesc>
              </SuggestionContentWrapper>
            )}
          </SuggestionError>
        ) : (
          <>
            {isOpen &&
              inputItems.map((item, index) => {
                let desc: undefined | string = undefined
                if (item.status !== QuickLinkStatus.new) {
                  const content = contents[item.nodeid]
                  if (content) desc = convertContentToRawText(content.content, ' ', { extra: searchExtra })
                  if (desc === '') desc = undefined
                }
                const icon = item.icon ? item.icon : fileList2Line
                if (nodeSelectState.clash && disallowClash && item.status === QuickLinkStatus.new) return null
                return (
                  <Suggestion
                    highlight={highlightedIndex === index}
                    key={`${item.value}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    <Icon width={24} icon={item.status === QuickLinkStatus.new ? addCircleLine : icon} />
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

export function isNew(input: string, items: Array<QuickLink>): boolean {
  const ti = input.trim()
  return items.filter((item) => item.text === ti).length === 0 && ti !== '' && !ti.startsWith(SEPARATOR)
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
