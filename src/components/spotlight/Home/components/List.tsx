import { ActiveItem, CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import { ActionItem, StyledList } from '../styled'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { findIndex, groupBy } from 'lodash'
import { Virtuoso } from 'react-virtuoso'

import { ActionTitle } from '../../Actions/styled'
import Item from './Item'
import useItemExecutor from '../actionExecutor'
import { useSaveChanges } from '../../Search/useSearchProps'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { useSpring } from 'react-spring'
import { QuickLinkType } from '../../../mex/NodeSelect/NodeSelect'
import { appNotifierWindow } from '../../../../electron/utils/notifiers'
import { IpcAction } from '../../../../data/IpcAction'
import { AppType } from '../../../../hooks/useInitialize'
import {
  convertContentToRawText,
  convertToCopySnippet,
  defaultCopyConverter,
  defaultCopyFilter,
  getTitleFromContent
} from '../../../../utils/search/parseData'
import { useSnippets } from '../../../../hooks/useSnippets'
import { mog } from '../../../../utils/lib/helper'
import { serializeHtml, createPlateEditor, createPlateUI, getPlateSelectors } from '@udecode/plate'
import getPlugins from '../../../../editor/Plugins/plugins'
import { ELEMENT_TAG } from '../../../../editor/Components/tag/defaults'
import { CopyTag } from '../../../../editor/Components/tag/components/CopyTag'
import { useTaskFromSelection } from '@hooks/useTaskFromSelection'
import { isParent } from '@components/mex/Sidebar/treeUtils'
import { BASE_TASKS_PATH } from '@data/Defaults/baseData'
import { useSpotlightSettingsStore } from '@store/settings.spotlight'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useSaveData } from '@hooks/useSaveData'
import { useRecentsStore } from '@store/useRecentsStore'

export const MAX_RECENT_ITEMS = 3

export enum KEYBOARD_KEYS {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Escape = 'Escape',
  Space = 'Space'
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
  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const addInRecents = useRecentsStore((store) => store.addRecent)

  const node = useSpotlightEditorStore((s) => s.node)
  const setPreviewEditorNode = useSpotlightEditorStore((s) => s.setNode)

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const { createNewNote } = useCreateNewNote()
  const { getSnippet } = useSnippets()
  const { saveData } = useSaveData()

  const { getNewTaskNode } = useTaskFromSelection()

  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

  const [showHover, setShowHover] = useState(false)

  const listStyle = useMemo(() => {
    const style = { width: '55%', marginRight: '0.5rem' }

    if (!normalMode) {
      style.width = '0%'
      style.marginRight = '0'
    }

    if (
      searchResults[activeIndex] &&
      searchResults[activeIndex]?.category !== CategoryType.backlink &&
      searchResults[activeIndex]?.category !== CategoryType.task
    ) {
      style.width = '100%'
      style.marginRight = '0'
    }

    if (
      searchResults[activeIndex] &&
      (searchResults[activeIndex]?.category === CategoryType.meeting ||
        searchResults[activeIndex]?.category === CategoryType.task)
    ) {
      if (normalMode) {
        style.width = '55%'
        style.marginRight = '0.5rem'
      } else {
        style.width = '0%'
        style.marginRight = '0'
      }
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const springProps = useSpring(listStyle)

  const { itemActionExecutor } = useItemExecutor()
  const spotlightTrigger = useSpotlightSettingsStore((state) => state.spotlightTrigger)

  const groups = Object.keys(groupBy(data, (n) => n.category))

  const { saveIt } = useSaveChanges()
  const indexes = React.useMemo(() => groups.map((gn) => findIndex(data, (n) => n.category === gn)), [groups])

  React.useEffect(() => {
    parentRef.current.scrollToIndex({
      index: activeIndex,
      behavior: 'smooth'
    })
  }, [activeIndex])

  const getInputText = (search: any) => {
    if (search?.value) return search.value.startsWith('[[') ? search.value.slice(2) : search.value
  }

  useEffect(() => {
    const handler = (event) => {
      setShowHover(false)

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
        event.preventDefault()
        const currentActiveItem = data[activeIndex]

        mog('Enter key pressed', { currentActiveItem })
        // * If current item is ILINK
        if (currentActiveItem?.category === CategoryType.backlink && !activeItem.active) {
          if (event.metaKey) {
            if (currentActiveItem?.type === QuickLinkType.backlink) {
              let nodePath = node.path
              const isNewTask = isParent(node.path, BASE_TASKS_PATH)
              if (currentActiveItem?.extras.new && !activeItem.active) {
                const text = getInputText(search)
                nodePath = search.value ? text : node.path

                // TODO: Create new note with specified 'nodeid' and 'path'.
                mog('NODE PATH IS', { nodePath, search })

                saveIt({
                  path: nodePath,
                  beforeSave: ({ path, noteId, noteContent }) => {
                    createNewNote({ path, noteId, noteContent })
                    saveData()
                  },
                  saveAndClose: true,
                  removeHighlight: true,
                  isNewTask
                })
              } else {
                saveIt({
                  path: nodePath,
                  saveAndClose: true,
                  removeHighlight: true,
                  isNewTask
                })

                if (selection) setSelection(undefined)
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
              addInRecents(node.nodeid)

              if (currentActiveItem?.extras.new && !activeItem.active) {
                const text = getInputText(search)
                const editorContent = getPlateSelectors().value()
                const title = getTitleFromContent(editorContent)
                nodePath = search.value ? text : title ? `Drafts.${title}` : node.path

                // TODO: Create new note with specified 'nodeid' and 'path'.
                createNewNote({ path: nodePath, noteId: node.nodeid })
              }
            }
          }
        } else if (currentActiveItem.category === CategoryType.task) {
          const node = getNewTaskNode(true)
          if (event.metaKey) {
            saveIt({ path: node.path, saveAndClose: true, removeHighlight: true, isNewTask: true })
            setSelection(undefined)
          } else {
            setPreviewEditorNode({
              ...node,
              title: node.path ?? 'Today Tasks',
              id: node.nodeid
            })
            addInRecents(node.nodeid)
            setNormalMode(false)
          }
          // setSelectedItem({ item: data[activeIndex], active: false })
        } else if (currentActiveItem.category === CategoryType.action) {
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
        } else if (currentActiveItem.category === CategoryType.meeting) {
          if (!event.metaKey && currentActiveItem.extras.customAction) currentActiveItem.extras.customAction()
          else window.open(currentActiveItem.extras.base_url, '_blank').focus()
        }
      }
    }

    if (normalMode) {
      window.addEventListener('keydown', handler)
    }

    return () => window.removeEventListener('keydown', handler)
  }, [data, activeIndex, node, nodeContent, normalMode, selection, selectedItem?.item, search])

  useEffect(() => {
    setActiveIndex(0)
  }, [spotlightTrigger])

  // * handles double click on a list item
  function handleDoubleClick(id: number) {
    const currentActiveItem = data[id]
    if (currentActiveItem?.type === QuickLinkType.backlink && !activeItem.active) {
      setNormalMode(false)
      if (currentActiveItem?.extras.new && !activeItem.active) {
        const node = useSpotlightEditorStore.getState().node

        const text = getInputText(search)
        const nodePath = search.value ? text : node.path

        // TODO: Create new note with specified 'nodeid' and 'path'.
        createNewNote({ path: nodePath, noteId: node.nodeid })
      }
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
      const filterdContent = convertToCopySnippet(snippet.content)
      const convertedContent = convertToCopySnippet(filterdContent, {
        filter: defaultCopyFilter,
        converter: defaultCopyConverter
      })

      const tempEditor = createPlateEditor({
        plugins: getPlugins(
          createPlateUI({
            [ELEMENT_TAG]: CopyTag as any
          }),
          {
            exclude: { dnd: true }
          }
        )
      })

      html = serializeHtml(tempEditor, {
        nodes: convertedContent
      })
    } catch (err) {
      mog('Something went wrong', { err })
    }

    const action = isUse ? IpcAction.USE_SNIPPET : IpcAction.COPY_TO_CLIPBOARD
    const title = isUse ? 'Snippet Pasted!' : 'Snippet Copied!'

    appNotifierWindow(action, AppType.SPOTLIGHT, { text, html, title })
  }

  return (
    <StyledList style={springProps}>
      {!data.length && <ActionTitle key={search.type}>{search.type}</ActionTitle>}
      <Virtuoso
        data={data}
        ref={parentRef}
        itemContent={(index, item) => {
          const lastItem = index > 0 ? data[index - 1] : undefined
          const active = index === activeIndex
          const handlers = {
            onClick: () => {
              setActiveIndex(index)
              const currentActiveItem = data[index]

              if (currentActiveItem?.type === ItemActionType.search) {
                setCurrentListItem(currentActiveItem)
                setSelectedItem({ item: currentActiveItem, active: true })
              }

              if (currentActiveItem?.type === QuickLinkType.snippet) {
                handleCopySnippet(currentActiveItem.id)
              }
            },
            onDoubleClick: () => {
              handleDoubleClick(index)
              setInput('')
            },
            onPointerMove: () => {
              setShowHover(true)
            }
          }
          return (
            <ActionItem key={index} {...handlers}>
              {item.category !== lastItem?.category && <ActionTitle key={item.category}>{item.category}</ActionTitle>}
              <Item active={active} key={item.id} item={item} showHover={showHover} />
            </ActionItem>
          )
        }}
      />
    </StyledList>
  )
}

export default List
