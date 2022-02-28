import { ActiveItem, CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import { ListItem, StyledList, usePointerMovedSinceMount } from '../styled'
import React, { useEffect, useMemo, useRef } from 'react'
import { findIndex, groupBy } from 'lodash'

import { ActionTitle } from '../../Actions/styled'
import { AppType } from '../../../../hooks/useInitialize'
import { IpcAction } from '../../../../data/IpcAction'
import Item from './Item'
import { NodeProperties } from '../../../../store/useEditorStore'
import { appNotifierWindow } from '../../../../electron/utils/notifiers'
import { mog } from '../../../../utils/lib/helper'
import { openNodeInMex } from '../../../../utils/combineSources'
import { useDataSaverFromContent } from '../../../../editor/Components/Saver'
import useDataStore from '../../../../store/useDataStore'
import useItemExecutor from '../actionExecutor'
import useLoad from '../../../../hooks/useLoad'
import { useRecentsStore } from '../../../../store/useRecentsStore'
import { useSaveChanges } from '../../Search/useSearchProps'
import { useSaveData } from '../../../../hooks/useSaveData'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { useSpring } from 'react-spring'
import { useVirtual } from 'react-virtual'

export const MAX_RECENT_ITEMS = 3

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
  const pointerMoved = usePointerMovedSinceMount()

  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const { saveData } = useSaveData()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const node = useSpotlightEditorStore((s) => s.node)

  const addInRecentResearchNodes = useRecentsStore((store) => store.addInResearchNodes)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const { getNode } = useLoad()
  const addILink = useDataStore((s) => s.addILink)

  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

  const listStyle = useMemo(() => {
    const style = { width: '55%' }

    if (!normalMode) {
      style.width = '0%'
    }
    if (searchResults[activeIndex]?.type !== ItemActionType.ilink) {
      style.width = '100%'
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const springProps = useSpring(listStyle)

  const { itemActionExecutor } = useItemExecutor()
  const groups = Object.keys(groupBy(data, (n) => n.category))

  const { saveIt } = useSaveChanges()
  const indexes = React.useMemo(() => groups.map((gn) => findIndex(data, (n) => n.category === gn)), [groups])

  const virtualizer = useVirtual({
    // estimateSize: useCallback(() => 120, []),
    size: data?.length ?? 0,
    parentRef
  })

  const { scrollToIndex, scrollToOffset } = virtualizer

  React.useEffect(() => {
    scrollToIndex(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()

        // * check if cmd + arrow up is pressed
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
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()

        // * check if cmd + arrow down is pressed
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
      } else if (event.key === 'Enter' && normalMode) {
        const currentActiveItem = data[activeIndex]
        if (currentActiveItem?.type === ItemActionType.ilink && !activeItem.active) {
          // if (!selection) return

          if (event.metaKey) {
            let newNode: NodeProperties = node

            if (currentActiveItem?.extras.new && !activeItem.active) {
              const nodeName = search.value.startsWith('[[') ? search.value.slice(2) : node.path

              const d = addILink({ ilink: nodeName, nodeid: node.nodeid })
              newNode = getNode(newNode.nodeid)
            }

            if (selection) {
              // addInRecentResearchNodes(newNode.nodeid)
              // saveEditorValueAndUpdateStores(newNode.nodeid, nodeContent, true)
              // saveData()

              // appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

              // setNormalMode(true)
              saveIt({ saveAndClose: true, removeHighlight: true })
              setSelection(undefined)
            } else {
              if (!currentActiveItem?.extras?.new) {
                openNodeInMex(newNode.nodeid)
              }
            }
            setSearch({ value: '', type: CategoryType.search })
          } else {
            setNormalMode(false)
          }
        } else {
          if (currentActiveItem?.type !== ItemActionType.search && selectedItem?.item?.type !== ItemActionType.search) {
            setSelectedItem({ item: data[activeIndex], active: false })
            itemActionExecutor(data[activeIndex])
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

  function handleDoubleClick(id: number) {
    const currentActiveItem = data[id]
    if (currentActiveItem?.type === ItemActionType.ilink && !activeItem.active) {
      setNormalMode(false)
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

  return (
    <StyledList style={springProps} ref={parentRef}>
      {!data.length && <ActionTitle>{search.type}</ActionTitle>}
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index]
          const handlers = {
            // onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index),
            // onClick: () => handleClick(virtualRow.index)
            onClick: () => {
              setActiveIndex(virtualRow.index)
              const currentActiveItem = data[virtualRow.index]

              if (currentActiveItem?.type === ItemActionType.search) {
                setCurrentListItem(currentActiveItem)
                setSelectedItem({ item: currentActiveItem, active: true })
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
              {item.category !== lastItem?.category && <ActionTitle>{item.category}</ActionTitle>}
              <Item item={item} active={active} />
            </ListItem>
          )
        })}
      </div>
    </StyledList>
  )
}

export default List
