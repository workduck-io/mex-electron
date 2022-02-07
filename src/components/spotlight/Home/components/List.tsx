import React, { useEffect, useRef, useState } from 'react'
import { useVirtual } from 'react-virtual'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { ActionTitle } from '../../Actions/styled'
import useItemExecutor from '../actionExecutor'
import { usePointerMovedSinceMount, StyledList, ListItem } from '../styled'
import Item from './Item'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import { mog } from '../../../../utils/lib/helper'
import { useSpotlightEditorStore } from '../../../../store/editor.spotlight'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'

export const MAX_RECENT_ITEMS = 3

const List = ({
  data,
  selectedItem,
  setSelectedItem,
  limit
}: {
  limit: number
  data: ListItemType[]
  selectedItem: ListItemType
  setSelectedItem: (action: ListItemType) => void
}) => {
  const { search, activeIndex, setActiveIndex } = useSpotlightContext()
  const parentRef = useRef(null)
  const [first, setFirst] = useState(false)
  const pointerMoved = usePointerMovedSinceMount()
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)

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
      } else if (
        event.key === 'Enter' &&
        data[activeIndex]?.type !== ItemActionType.search &&
        selectedItem?.type !== ItemActionType.search
      ) {
        event.preventDefault()
        setSelectedItem(data[activeIndex])
        itemActionExecutor(data[activeIndex])
        // if (data[activeIndex].type === ActionType.render) {
        //   setShowResults(false)
        // }
        mog('WHAT', { activeIndex, d: data[activeIndex] })
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (!first) {
          setSelectedItem(data[activeIndex])
          setCurrentListItem(data[activeIndex])
          setFirst(true)
        } else {
          itemActionExecutor(selectedItem, search.value)
          setFirst(false)
          setSelectedItem(null)
        }
        setInput('')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [data, activeIndex, selectedItem, search.value])

  useEffect(() => {
    setActiveIndex(0)
  }, [data])

  function handleClick(id: number) {
    if (data[id]?.type !== ItemActionType.search && selectedItem?.type !== ItemActionType.search) {
      setSelectedItem(data[id])
      itemActionExecutor(data[id])
      if (data[id].type === ItemActionType.render) {
        // setShowResults(false)
      }
    } else {
      if (!first) {
        setSelectedItem(data[id])
        setFirst(true)
      } else {
        itemActionExecutor(selectedItem, search.value)
      }
    }
  }

  return (
    <StyledList ref={parentRef}>
      <ActionTitle>Recents</ActionTitle>
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index]
          mog('item', { item })
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
