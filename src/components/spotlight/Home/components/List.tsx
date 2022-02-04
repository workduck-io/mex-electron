import data from '@iconify-icons/ri/save-line'
import React, { useEffect, useRef, useState } from 'react'
import { useVirtual } from 'react-virtual'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { actionExec, ActionType, MexitAction } from '../actionExecutor'
import { usePointerMovedSinceMount, StyledList, ListItem } from '../styled'
import Item from './Item'

const List = ({
  data,
  currentAction,
  setCurrentAction
}: {
  data: MexitAction[]
  currentAction: MexitAction
  setCurrentAction: (action: MexitAction) => void
}) => {
  const { search } = useSpotlightContext()
  const parentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [first, setFirst] = useState(false)
  const pointerMoved = usePointerMovedSinceMount()

  const virtualizer = useVirtual({
    size: 10,
    parentRef
  })

  const { scrollToIndex } = virtualizer

  React.useEffect(() => {
    scrollToIndex(activeIndex, {
      // To ensure that we don't move past the first item
      align: activeIndex < 1 ? 'start' : 'auto'
    })
  }, [activeIndex, scrollToIndex])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index > 0 ? index - 1 : index

          // avoid setting active index on a group
          if (typeof data[nextIndex] === 'string') {
            if (nextIndex === 0) return index
            nextIndex -= 1
          }
          return nextIndex
        })
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => {
          let nextIndex = index < data.length - 1 ? index + 1 : index

          // avoid setting active index on a group
          if (typeof data[nextIndex] === 'string') {
            if (nextIndex === data.length - 1) return index
            nextIndex += 1
          }
          return nextIndex
        })
        // TODO: improve the code below for the love of anything
      } else if (
        event.key === 'Enter' &&
        data[activeIndex]?.type !== ActionType.search &&
        currentAction?.type !== ActionType.search
      ) {
        event.preventDefault()
        setCurrentAction(data[activeIndex])
        actionExec(data[activeIndex])
        // if (data[activeIndex].type === ActionType.render) {
        //   setShowResults(false)
        // }
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (!first) {
          setCurrentAction(data[activeIndex])
          setFirst(true)
        } else {
          actionExec(currentAction, search)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [data, activeIndex, currentAction])

  useEffect(() => {
    setActiveIndex(0)
  }, [data])

  // function handleClick(id: number) {
  //   if (data[id]?.type !== ActionType.search && selectedAction?.type !== ActionType.search) {
  //     setSelectedAction(data[id])
  //     actionExec(data[id])
  //     if (data[id].type === ActionType.render) {
  //       setShowResults(false)
  //     }
  //   } else {
  //     if (!first) {
  //       setSelectedAction(data[id])
  //       setFirst(true)
  //       setQuery('')
  //       setShowResults(false)
  //     } else {
  //       actionExec(selectedAction, query)
  //     }
  //   }
  // }

  return (
    <StyledList ref={parentRef}>
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index]
          const handlers = {
            onPointerMove: () => pointerMoved && setActiveIndex(virtualRow.index)
            // onClick: () => handleClick(virtualRow.index)
          }
          const active = virtualRow.index === activeIndex

          return (
            <ListItem key={virtualRow.index} ref={virtualRow.measureRef} start={virtualRow.start} {...handlers}>
              <Item item={item} active={active} />
            </ListItem>
          )
        })}
      </div>
    </StyledList>
  )
}

export default List
