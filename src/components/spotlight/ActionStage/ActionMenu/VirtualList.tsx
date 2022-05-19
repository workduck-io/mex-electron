import { KEYBOARD_KEYS } from '@components/spotlight/Home/components/List'
import { mog } from '@utils/lib/helper'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

type VirtualListProps<T> = {
  items: Array<T>
  activeItems?: Array<T> | undefined
  onEnter: (item: T) => void
  onClick?: (item: T) => void
  getIsActive?: (item: T, activeItems: Array<T> | T) => boolean
  ItemRenderer: FunctionComponent<{
    index?: number
    item: T
    highlight?: boolean
    isActive?: boolean
    onClick: (item: T) => void
  }>
}

const VirtualList = <T,>({ items, activeItems, getIsActive, onEnter, onClick, ItemRenderer }: VirtualListProps<T>) => {
  const [index, setIndex] = useState(0)
  const ref = useRef(null)

  const scrollTo = (index: number) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        index,
        align: 'start',
        behavior: 'smooth'
      })
    }
  }

  const nextItem = () => {
    setIndex((next) => {
      const nextIndex = next === items.length - 1 ? next : next + 1
      scrollTo(nextIndex)
      return nextIndex
    })
  }

  const prevItem = () => {
    setIndex((prev) => {
      const prevIndex = prev === 0 ? prev : prev - 1
      scrollTo(prevIndex)
      return prevIndex
    })
  }

  useEffect(() => {
    const handler = (event) => {
      switch (event.code) {
        case KEYBOARD_KEYS.ArrowUp:
          event.preventDefault()
          event.stopPropagation()
          prevItem()
          break
        case KEYBOARD_KEYS.ArrowDown:
          event.preventDefault()
          event.stopPropagation()
          nextItem()
          break
        case KEYBOARD_KEYS.Space:
        case KEYBOARD_KEYS.Enter:
          event.preventDefault()
          event.stopPropagation()
          onEnter(items[index])
          break
        default:
          mog('event pressed', { event })
      }
    }

    window?.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [items, index])

  return (
    <Virtuoso
      data={items}
      tabIndex={-1}
      style={{ height: '310px' }}
      ref={ref}
      key="wd-mex-action-menu-list"
      id="wd-mex-action-menu-list"
      itemContent={(itemIndex, item) => {
        const isActive = typeof getIsActive === 'function' && getIsActive(item, activeItems)

        return (
          <ItemRenderer
            key={itemIndex}
            index={itemIndex}
            highlight={itemIndex === index}
            isActive={isActive}
            item={item}
            onClick={() => {
              onClick(item)
            }}
          />
        )
      }}
    />
  )
}

export default VirtualList
