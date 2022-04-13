import { ActiveItem, CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import { ListItem, StyledList } from '../styled'
import React, { useEffect, useMemo, useRef } from 'react'
import { findIndex, groupBy } from 'lodash'

import { ActionTitle } from '../../Actions/styled'
import Item from './Item'
import useItemExecutor from '../actionExecutor'
import { useSaveChanges } from '../../Search/useSearchProps'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { useSpring } from 'react-spring'
import { useVirtual } from 'react-virtual'
import { QuickLinkType } from '../../../mex/NodeSelect/NodeSelect'
import { appNotifierWindow } from '../../../../electron/utils/notifiers'
import { IpcAction } from '../../../../data/IpcAction'
import { AppType } from '../../../../hooks/useInitialize'
import { convertContentToRawText } from '../../../../utils/search/parseData'
import { useSnippets } from '../../../../hooks/useSnippets'
import { getPlateEditorRef, serializeHtml } from '@udecode/plate'
import useDataStore from '../../../../store/useDataStore'
import { mog } from '../../../../utils/lib/helper'

export const MAX_RECENT_ITEMS = 3

export enum KEYBOARD_KEYS {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Escape = 'Escape'
}

const List = ({
  data,
  selectedItem,
  setSelectedItem
}: {
  data: ListItemType[]
  selectedItem: ActiveItem
  setSelectedItem: (action: ActiveItem) => void
}) => {
  const { search, setSelection, activeIndex, searchResults, activeItem, setSearch, selection, setActiveIndex } =
    useSpotlightContext()
  const parentRef = useRef(null)

  const addILink = useDataStore((store) => store.addILink)
  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  const node = useSpotlightEditorStore((s) => s.node)

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const { getSnippet } = useSnippets()

  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

  const listStyle = useMemo(() => {
    const style = { width: '55%' }

    if (!normalMode) {
      style.width = '0%'
    }

    if (searchResults[activeIndex] && searchResults[activeIndex]?.category !== CategoryType.quicklink) {
      style.width = '100%'
    }

    if (searchResults[activeIndex] && searchResults[activeIndex]?.category === CategoryType.meeting) {
      if (normalMode) style.width = '55%'
      else style.width = '0%'
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const springProps = useSpring(listStyle)

  const { itemActionExecutor } = useItemExecutor()
  const groups = Object.keys(groupBy(data, (n) => n.category))

  const { saveIt } = useSaveChanges()
  const indexes = React.useMemo(() => groups.map((gn) => findIndex(data, (n) => n.category === gn)), [groups])

  const virtualizer = useVirtual({
    size: data?.length ?? 0,
    parentRef
  })

  const { scrollToIndex } = virtualizer

  React.useEffect(() => {
    scrollToIndex(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === KEYBOARD_KEYS.ArrowUp) {
        event.preventDefault()

        // * check if CMD + ARROW_UP is pressed
        if (event.metaKey) {
          for (let i = indexes[indexes.length - 1]; i > -1; i--) {
            const categoryIndex = indexes[i]
            if (categoryIndex < activeIndex && data[categoryIndex].category !== data[activeIndex].category) {
              setActiveIndex(categoryIndex)
              break
            }
          }
        } else
          setActiveIndex((index: number) => {
            let nextIndex = index > 0 ? index - 1 : index

            // avoid setting active index on a group
            if (typeof data[nextIndex] === 'string') {
              if (nextIndex === 0) nextIndex = index
              else nextIndex -= 1
            }

            return nextIndex
          })
      } else if (event.key === KEYBOARD_KEYS.ArrowDown) {
        event.preventDefault()

        // * check if CMD + ARROW_DOWN is pressed
        if (event.metaKey) {
          for (let i = 0; i < indexes.length; i++) {
            const categoryIndex = indexes[i]
            if (categoryIndex > activeIndex && data[categoryIndex].category !== data[activeIndex].category) {
              setActiveIndex(categoryIndex)
              break
            }
          }
        } else
          setActiveIndex((index) => {
            let nextIndex = index < data.length - 1 ? index + 1 : index

            // * avoid setting active index on a group
            if (typeof data[nextIndex] === 'string') {
              if (nextIndex === data.length - 1) nextIndex = index
              else nextIndex += 1
            }

            return nextIndex
          })
      } else if (event.key === KEYBOARD_KEYS.Enter && normalMode) {
        const currentActiveItem = data[activeIndex]

        // * If current item is ILINK
        if (currentActiveItem?.category === CategoryType.quicklink && !activeItem.active) {
          if (event.metaKey) {
            if (currentActiveItem?.type === QuickLinkType.backlink) {
              let nodePath = node.path
              if (currentActiveItem?.extras.new && !activeItem.active) {
                nodePath = search.value.startsWith('[[') ? search.value.slice(2) : node.path
                addILink({ ilink: nodePath, nodeid: node.nodeid })
              }

              if (selection) {
                saveIt({ path: nodePath, saveAndClose: true, removeHighlight: true })
                setSelection(undefined)
              }

              setSearch({ value: '', type: CategoryType.search })
            }

            if (currentActiveItem?.type === QuickLinkType.snippet) {
              handleCopySnippet(currentActiveItem.id, true)
            }
          } else {
            if (currentActiveItem.type === QuickLinkType.snippet) {
              handleCopySnippet(currentActiveItem.id, false)
              setInput('')
            } else {
              let nodePath = node.path
              setNormalMode(false)

              if (currentActiveItem?.extras.new && !activeItem.active) {
                nodePath = search.value.startsWith('[[') ? search.value.slice(2) : node.path
                addILink({ ilink: nodePath, nodeid: node.nodeid })
              }
            }
          }
        } else if (
          currentActiveItem.category === CategoryType.action ||
          currentActiveItem.category === CategoryType.meeting
        ) {
          if (currentActiveItem?.type !== ItemActionType.search && selectedItem?.item?.type !== ItemActionType.search) {
            setSelectedItem({ item: data[activeIndex], active: false })
            itemActionExecutor(data[activeIndex], undefined, event.metaKey)
          } else {
            if (!selectedItem?.active) {
              setCurrentListItem(data[activeIndex])
              setSelectedItem({ item: data[activeIndex], active: true })
            } else {
              itemActionExecutor(selectedItem?.item, search.value)
              setSelectedItem({ item: null, active: false })
            }
            setInput('')
          }
        }
      }
    }

    if (normalMode) {
      window.addEventListener('keydown', handler)
    }

    return () => window.removeEventListener('keydown', handler)
  }, [data, activeIndex, node, nodeContent, normalMode, selection, selectedItem?.item, search.value])

  useEffect(() => {
    setActiveIndex(0)
  }, [data])

  // * handles double click on a list item
  function handleDoubleClick(id: number) {
    const currentActiveItem = data[id]
    if (currentActiveItem?.type === QuickLinkType.backlink && !activeItem.active) {
      setNormalMode(false)
    } else if (currentActiveItem?.type === QuickLinkType.snippet && !activeItem.active) {
      handleCopySnippet(currentActiveItem.id, true)
    } else {
      if (currentActiveItem?.type !== ItemActionType.search && selectedItem?.item?.type !== ItemActionType.search) {
        setSelectedItem({ item: currentActiveItem, active: false })
        itemActionExecutor(currentActiveItem)
      } else if (selectedItem.active) {
        itemActionExecutor(selectedItem?.item, search.value)
        setSelectedItem({ item: null, active: false })
      }
      setInput('')
    }
  }

  const handleCopySnippet = (id: string, isUse?: boolean) => {
    const snippet = getSnippet(id)
    const text = convertContentToRawText(snippet.content, '\n')

    let html = text

    try {
      html = serializeHtml(getPlateEditorRef(), {
        nodes: snippet.content
      })
    } catch (err) {
      mog('Something went wrong', { err })
    }

    const action = isUse ? IpcAction.USE_SNIPPET : IpcAction.COPY_TO_CLIPBOARD

    appNotifierWindow(action, AppType.SPOTLIGHT, { text, html })
  }

  return (
    <StyledList style={springProps} ref={parentRef}>
      {!data.length && <ActionTitle key={search.type}>{search.type}</ActionTitle>}
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index]
          const handlers = {
            onClick: () => {
              setActiveIndex(virtualRow.index)
              const currentActiveItem = data[virtualRow.index]

              if (currentActiveItem?.type === ItemActionType.search) {
                setCurrentListItem(currentActiveItem)
                setSelectedItem({ item: currentActiveItem, active: true })
              }

              if (currentActiveItem?.type === QuickLinkType.snippet) {
                handleCopySnippet(currentActiveItem.id)
              }
            },
            onDoubleClick: () => {
              handleDoubleClick(virtualRow.index)
              setInput('')
            }
          }

          const index = virtualRow.index
          const active = index === activeIndex
          const lastItem = index > 0 ? data[index - 1] : undefined

          return (
            <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
              {item.category !== lastItem?.category && <ActionTitle key={item.category}>{item.category}</ActionTitle>}
              <Item key={item.id} item={item} active={active} />
            </ListItem>
          )
        })}
      </div>
    </StyledList>
  )
}

export default List
