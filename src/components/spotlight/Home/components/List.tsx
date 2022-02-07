import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useVirtual } from 'react-virtual'
import { ActiveItem, SearchType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { ActionTitle } from '../../Actions/styled'
import useItemExecutor from '../actionExecutor'
import { usePointerMovedSinceMount, StyledList, ListItem } from '../styled'
import Item from './Item'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { defaultContent } from '../../../../data/Defaults/baseData'
import { IpcAction } from '../../../../data/IpcAction'
import { getNewDraftKey } from '../../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../../electron/utils/notifiers'
import { AppType } from '../../../../hooks/useInitialize'
import { NodeProperties } from '../../../../store/useEditorStore'
import { getContent } from '../../../../utils/helpers'
import { createNodeWithUid } from '../../../../utils/lib/helper'
import { useSaveData } from '../../../../hooks/useSaveData'
import { useDataSaverFromContent } from '../../../../editor/Components/Saver'
import useLoad from '../../../../hooks/useLoad'
import useDataStore from '../../../../store/useDataStore'
import { useSpring } from 'react-spring'

export const MAX_RECENT_ITEMS = 3

const List = ({
  data,
  selectedItem,
  setSelectedItem,
  limit
}: {
  limit: number
  data: ListItemType[]
  selectedItem: ActiveItem
  setSelectedItem: (action: ActiveItem) => void
}) => {
  const { search, setSelection, activeIndex, activeItem, setSearch, selection, setActiveIndex } = useSpotlightContext()
  const parentRef = useRef(null)
  const pointerMoved = usePointerMovedSinceMount()

  const setNode = useSpotlightEditorStore((s) => s.setNode)
  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const loadNode = useSpotlightEditorStore((s) => s.loadNode)
  const { saveData } = useSaveData()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const node = useSpotlightEditorStore((s) => s.node)

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const { getNode } = useLoad()
  const addILink = useDataStore((s) => s.addILink)
  const setIsPreview = useSpotlightEditorStore((s) => s.setIsPreview)

  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

  const listStyle = useMemo(() => {
    const style = { width: '100%', opacity: 1, marginRight: '0' }
    if (activeItem?.item) return style

    if (selection || !normalMode) {
      if (!search.value) style.width = '0%'
      else {
        if (search.type === SearchType.action) style.width = '100%'
        else style.width = '50%'
      }
    } else {
      if (!search.value) style.width = '100%'
      else {
        if (search.type === SearchType.action) style.width = '100%'
        else style.width = '50%'
      }
    }

    if (style.width === '0%') style.opacity = 0
    else if (style.width === '50%') style.marginRight = '0.5rem'
    else style.opacity = 1

    return style
  }, [selection, search.value, normalMode, activeItem.item])

  const springProps = useSpring(listStyle)

  const { itemActionExecutor } = useItemExecutor()

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
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index: number) => {
          let nextIndex = index > 0 ? index - 1 : index

          // avoid setting active index on a group
          if (typeof data[nextIndex] === 'string') {
            if (nextIndex === 0) nextIndex = index
            else nextIndex -= 1
          }

          return nextIndex
        })

        if (data[activeIndex]?.extras?.new) setIsPreview(false)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index < data.length - 1 ? index + 1 : index

          // * avoid setting active index on a group
          if (typeof data[nextIndex] === 'string') {
            if (nextIndex === data.length - 1) nextIndex = index
            else nextIndex += 1
          }

          return nextIndex
        })
      } else if (event.key === 'Enter') {
        if (data[activeIndex]?.type === ItemActionType.ilink) {
          let newNode: NodeProperties
          if (data[activeIndex]?.extras.new) {
            const isDraftNode = node && node.key.startsWith('Draft.')
            newNode = isDraftNode ? node : createNodeWithUid(getNewDraftKey())

            const nodeName = search.value.startsWith('[[') ? search.value.slice(2) : search.value

            const d = addILink(nodeName, newNode.nodeid)
            newNode = getNode(newNode.nodeid)
          } else {
            newNode = getNode(data[activeIndex]?.extras?.nodeid)
          }

          setSearch({ value: '', type: SearchType.search })

          if (selection) {
            const newNodeContent = getContent(newNode.nodeid)
            const newContentData = !data[activeIndex]?.extras?.new
              ? [...newNodeContent.content, ...nodeContent]
              : nodeContent
            saveEditorValueAndUpdateStores(newNode.nodeid, newContentData, true)
            saveData()

            appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

            loadNode(createNodeWithUid(getNewDraftKey()), defaultContent.content)

            setNormalMode(true)
            setSelection(undefined)
          } else {
            setNode(newNode)
            setNormalMode(false)
            setSelection(undefined)
          }
        } else {
          if (data[activeIndex]?.type !== ItemActionType.search && selectedItem?.item?.type !== ItemActionType.search) {
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

    if ((!selection && normalMode) || search.value) {
      window.addEventListener('keydown', handler)
    }

    return () => window.removeEventListener('keydown', handler)
  }, [data, activeIndex, normalMode, selection, selectedItem?.item, search.value])

  useEffect(() => {
    setActiveIndex(0)
  }, [data])

  function handleClick(id: number) {
    if (data[id]?.type !== ItemActionType.search && selectedItem?.item?.type !== ItemActionType.search) {
      setSelectedItem({ item: data[id], active: false })
      itemActionExecutor(data[id])
    } else {
      if (!selectedItem?.active) {
        setSelectedItem({ item: data[id], active: true })
      } else {
        itemActionExecutor(selectedItem?.item, search.value)
      }
    }
  }

  return (
    <StyledList style={springProps} ref={parentRef}>
      <ActionTitle>Recents</ActionTitle>
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index]
          const handlers = {
            onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index),
            onClick: () => handleClick(virtualRow.index)
          }
          const active = virtualRow.index === activeIndex

          return (
            <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
              {virtualRow.index === limit && (
                <>
                  <ActionTitle>Quick Actions</ActionTitle>
                </>
              )}
              <Item item={item} active={active} />
            </ListItem>
          )
        })}
      </div>
    </StyledList>
  )
}

export default List
