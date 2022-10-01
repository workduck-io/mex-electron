import React, { useEffect, useMemo, useRef, useState } from 'react'

import { isParent } from '@components/mex/Sidebar/treeUtils'
import { getDefaultContent } from '@components/spotlight/Preview'
import { BASE_TASKS_PATH } from '@data/Defaults/baseData'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useLastOpened, useLastUsedSnippets } from '@hooks/useLastOpened'
import { useNodes } from '@hooks/useNodes'
import { useSaveData } from '@hooks/useSaveData'
import { usePlatformInfo } from '@hooks/useShortcutListener'
import { useTaskFromSelection } from '@hooks/useTaskFromSelection'
import { useSpotlightSettingsStore } from '@store/settings.spotlight'
import { useRecentsStore } from '@store/useRecentsStore'
import { serializeHtml, createPlateEditor, createPlateUI, getPlateSelectors } from '@udecode/plate'
import { getContent } from '@utils/helpers'
import { findIndex, groupBy } from 'lodash'
import { useSpring } from 'react-spring'
import { Virtuoso } from 'react-virtuoso'

import { tinykeys } from '@workduck-io/tinykeys'

import { IpcAction } from '../../../../data/IpcAction'
import { CopyTag } from '../../../../editor/Components/tag/components/CopyTag'
import { ELEMENT_TAG } from '../../../../editor/Components/tag/defaults'
import getPlugins from '../../../../editor/Plugins/plugins'
import { appNotifierWindow } from '../../../../electron/utils/notifiers'
import { AppType } from '../../../../hooks/useInitialize'
import { useSnippets } from '../../../../hooks/useSnippets'
import { ActiveItem, CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { NodeType } from '../../../../types/Types'
import { mog } from '../../../../utils/lib/helper'
import {
  convertContentToRawText,
  convertToCopySnippet,
  defaultCopyConverter,
  defaultCopyFilter,
  getTitleFromContent
} from '../../../../utils/search/parseData'
import { QuickLinkType } from '../../../mex/NodeSelect/NodeSelect'
import { ActionTitle } from '../../Actions/styled'
import { useSaveChanges } from '../../Search/useSearchProps'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import useItemExecutor from '../actionExecutor'
import { ActionItem, StyledList } from '../styled'
import Item from './Item'

export const MAX_RECENT_ITEMS = 3

export enum KEYBOARD_KEYS {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
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
  const {
    search,
    setSelection,
    setActiveItem,
    activeIndex,
    searchResults,
    activeItem,
    setSearch,
    selection,
    setActiveIndex,
    selectedNamespace
  } = useSpotlightContext()
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
  const { getNodeType } = useNodes()
  const { addLastUsed } = useLastUsedSnippets()

  const { getNewTaskNode } = useTaskFromSelection()

  const { debouncedAddLastOpened } = useLastOpened()

  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

  const [showHover, setShowHover] = useState(false)

  const listStyle = useMemo(() => {
    const style = { width: '55%', marginRight: '0.5rem' }

    if (!normalMode) {
      style.width = '0%'
      style.marginRight = '0'
    }

    const itemCategory = searchResults?.[activeIndex]?.category

    if (
      itemCategory !== CategoryType.backlink &&
      itemCategory !== CategoryType.pinned &&
      itemCategory !== CategoryType.task
    ) {
      style.width = '100%'
      style.marginRight = '0'
    }

    if (itemCategory === CategoryType.meeting || itemCategory === CategoryType.task) {
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

  const platformModifierKeys = usePlatformInfo()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [KEYBOARD_KEYS.ArrowUp]: (event) => {
        event.preventDefault()
        setShowHover(false)

        if (event.metaKey) {
          for (let i = indexes[indexes.length - 1]; i > -1; i--) {
            const categoryIndex = indexes[i]
            const isDifferentCategory = data[categoryIndex].category !== data[activeIndex].category
            if (categoryIndex < activeIndex && isDifferentCategory) {
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
      },
      [KEYBOARD_KEYS.ArrowDown]: (event) => {
        event.preventDefault()
        setShowHover(false)

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
      },
      [`${platformModifierKeys.CONTROL}+c`]: (event) => {
        const currentActiveItem = data[activeIndex]
        mog('CTRL C')
        if (currentActiveItem?.category === CategoryType.backlink) {
          handleCopyActiveItem(currentActiveItem.id)
        }
      },
      [`${platformModifierKeys.CONTROL}+v`]: (event) => {
        const currentActiveItem = data[activeIndex]
        mog('CTRL V')

        if (currentActiveItem?.category === CategoryType.backlink) {
          handleCopyActiveItem(currentActiveItem.id, true)
        }
      }
    })

    if (!normalMode) unsubscribe()

    return () => unsubscribe()
  }, [activeIndex, data, normalMode])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === KEYBOARD_KEYS.Enter && normalMode) {
        event.preventDefault()
        const currentActiveItem = data[activeIndex]
        const isPinnedNote = currentActiveItem.category === CategoryType.pinned
        const isNoteCategory = currentActiveItem?.category === CategoryType.backlink || isPinnedNote
        // * If current item is ILINK
        if (isNoteCategory && !activeItem.active) {
          // mog('Matched with node')
          if (event.metaKey) {
            if (currentActiveItem?.type === QuickLinkType.backlink) {
              let nodePath = node.path
              const isNewTask = isParent(node.path, BASE_TASKS_PATH)
              if (currentActiveItem?.extras.new && !activeItem.active) {
                const text = getInputText(search)
                nodePath = search.value ? text : node.path

                saveIt({
                  path: nodePath,
                  beforeSave: ({ path, noteId, noteContent }) => {
                    // mog('Create new note save', { path, noteId, noteContent, namespace: selectedNamespace })
                    createNewNote({ path, noteId, noteContent, namespace: selectedNamespace })
                    saveData()
                  },
                  saveAndClose: true,
                  saveToFile: true,
                  removeHighlight: true,
                  isNewTask
                })
              } else {
                if (selection) {
                  saveIt({
                    path: nodePath,
                    removeHighlight: true,
                    isNewTask
                  })
                  setSelection(undefined)
                }

                if (isPinnedNote) {
                  appNotifierWindow(IpcAction.SHOW_PINNED_NOTE_WINDOW, AppType.SPOTLIGHT, { noteId: node.nodeid })
                }
              }

              setSearch({ value: '', type: CategoryType.search })
            }

            if (currentActiveItem?.type === QuickLinkType.snippet) {
              handleCopyActiveItem(currentActiveItem.id, true)
              addLastUsed(currentActiveItem.id)
            }
          } else {
            if (currentActiveItem.type === QuickLinkType.snippet) {
              handleCopyActiveItem(currentActiveItem.id, false)
              setInput('')
              addLastUsed(currentActiveItem.id)
            } else {
              let nodePath = node.path

              if (isPinnedNote) {
                if (selection) {
                  const isNewTask = isParent(nodePath, BASE_TASKS_PATH)
                  saveIt({
                    path: nodePath,
                    saveAndClose: true,
                    saveToFile: false,
                    removeHighlight: true,
                    isNewTask
                  })
                }

                appNotifierWindow(IpcAction.SHOW_PINNED_NOTE_WINDOW, AppType.SPOTLIGHT, { noteId: node.nodeid })

                return
              }

              addInRecents(node.nodeid)
              setNormalMode(false)
              debouncedAddLastOpened(node.nodeid)

              if (currentActiveItem?.extras.new && !activeItem.active) {
                const text = getInputText(search)
                const editorContent = getPlateSelectors().value()
                const title = getTitleFromContent(editorContent)
                nodePath = search.value ? text : title ? `Drafts.${title}` : node.path

                // TODO: Create new note with specified 'nodeid' and 'path'.
                // mog('Create new note with specified nodeid and path', {
                //   nodeid: node.nodeid,
                //   path: nodePath,
                //   selectedNamespace
                // })
                createNewNote({ path: nodePath, noteId: node.nodeid, namespace: selectedNamespace })
              }
            }
          }
        } else if (currentActiveItem.category === CategoryType.task) {
          if (event.metaKey) {
            const node = getNewTaskNode(false)
            if (!node) {
              saveIt({
                beforeSave: ({ path, noteId, noteContent }) => {
                  getNewTaskNode(true, noteContent)
                  saveData()
                },
                saveAndClose: true,
                removeHighlight: true,
                saveToFile: true,
                isNewTask: true
              })
            } else {
              saveIt({
                path: node.path,
                saveAndClose: true,
                saveToFile: true,
                removeHighlight: true,
                isNewTask: true
              })
            }

            setSelection(undefined)
            setSearch({ value: '', type: CategoryType.search })
            setActiveItem({ item: null, active: false })
          } else {
            const node = getNewTaskNode(true)
            setPreviewEditorNode({
              ...node,
              title: node.path ?? 'Today Tasks',
              id: node.nodeid
            })
            addInRecents(node.nodeid)
            debouncedAddLastOpened(node.nodeid)
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
  }, [data, activeIndex, selectedNamespace, node, nodeContent, normalMode, selection, selectedItem?.item, search])

  useEffect(() => {
    setActiveIndex(0)
  }, [spotlightTrigger])

  // * handles double click on a list item
  function handleDoubleClick(id: number) {
    const currentActiveItem = data[id]
    const isNote = currentActiveItem?.type === QuickLinkType.backlink

    if (isNote && !activeItem.active) {
      if (currentActiveItem?.category === CategoryType.pinned) {
        if (selection) {
          const notePath = node.path
          const isNewTask = isParent(notePath, BASE_TASKS_PATH)
          saveIt({
            path: notePath,
            saveAndClose: true,
            saveToFile: false,
            removeHighlight: true,
            isNewTask
          })
        }
        appNotifierWindow(IpcAction.SHOW_PINNED_NOTE_WINDOW, AppType.SPOTLIGHT, { noteId: node.nodeid })

        return
      }

      setNormalMode(false)
      if (currentActiveItem?.extras.new && !activeItem.active) {
        const node = useSpotlightEditorStore.getState().node

        const text = getInputText(search)
        const nodePath = search.value ? text : node.path

        // TODO: Create new note with specified 'nodeid' and 'path'.
        // mog('Create new note with specified nodeid and path', {
        //   nodeid: node.nodeid,
        //   path: nodePath,
        //   selectedNamespace
        // })
        createNewNote({ path: nodePath, noteId: node.nodeid, namespace: selectedNamespace })
      }
    } else if (currentActiveItem?.type === QuickLinkType.snippet && !activeItem.active) {
      handleCopyActiveItem(currentActiveItem.id, true)
      addLastUsed(currentActiveItem.id)
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

  const getContentByType = (id: string) => {
    const isNode = getNodeType(id)
    switch (isNode) {
      case NodeType.DEFAULT:
        return getContent(id)?.content ?? getDefaultContent()
      case NodeType.SNIPPET:
      default:
        return getSnippet(id)?.content ?? getDefaultContent()
    }
  }

  const handleCopyActiveItem = (id: string, isUse?: boolean) => {
    const content = getContentByType(id)
    const text = convertContentToRawText(content, '\n')

    let html = text

    try {
      const filterdContent = convertToCopySnippet(content)
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
                handleCopyActiveItem(currentActiveItem.id)
                addLastUsed(currentActiveItem.id)
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
