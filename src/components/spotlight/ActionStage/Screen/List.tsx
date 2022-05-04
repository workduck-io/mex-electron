import React, { useEffect, useRef, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import Row from './Row'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { NotFoundText } from '../../../../style/Form'
import { Icon } from '@iconify/react'
import { useActionStore } from '../../Actions/useActionStore'
import { ActionItem } from '../../Home/styled'
import { KEYBOARD_KEYS } from '../../Home/components/List'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { NavigationType, useRouting } from '../../../../views/routes/urls'
import { Virtuoso } from 'react-virtuoso'

export const FullWidth = styled.div<{ narrow: boolean }>`
  width: 100%;
  ${({ narrow }) =>
    narrow
      ? css`
          height: calc(84vh - 2.75rem);
          max-height: calc(84vh - 2.75rem);
        `
      : css`
          height: 84vh;
          max-height: 84vh;
        `}
  overflow-y: auto;
  overflow-behavior: contain;
  margin-top: 0.5rem;
`

const RelativeList = styled(FullWidth)`
  position: relative;
`

type ListProps = {
  items: Array<any>
}

export const ROW_ITEMS_LIMIT = 7

const List: React.FC<ListProps> = ({ items }) => {
  const theme = useTheme()
  const activeAction = useActionStore((store) => store.activeAction)
  const [activeIndex, setActiveIndex] = useState(0)
  const setViewData = useSpotlightAppStore((store) => store.setViewData)
  const setView = useSpotlightAppStore((store) => store.setView)
  const isMenuOpen = useSpotlightAppStore((store) => store.isMenuOpen)
  const { goTo } = useRouting()

  const parentRef = useRef(null)

  const onSelect = (i: any) => {
    setActiveIndex(i)
    setView('item')
    setViewData(items[i])
    goTo('/action/view', NavigationType.push)
  }

  const nextItem = () => {
    setActiveIndex((next) => {
      const nextIndex = next === items.length - 1 ? next : next + 1
      scrollTo(nextIndex)
      return nextIndex
    })
  }

  const prevItem = () => {
    setActiveIndex((prev) => {
      const prevIndex = prev === 0 ? prev : prev - 1
      scrollTo(prevIndex)
      return prevIndex
    })
  }

  const scrollTo = (itemIndex: number) =>
    parentRef?.current?.scrollToIndex({
      index: itemIndex,
      align: 'start',
      behavior: 'smooth'
    })

  useEffect(() => {
    if (items && items.length > 0) scrollTo(0)
  }, [items])

  useEffect(() => {
    const handler = (event) => {
      if (isMenuOpen) return

      if (event.key === KEYBOARD_KEYS.ArrowUp) {
        event.preventDefault()
        prevItem()
      } else if (event.key === KEYBOARD_KEYS.ArrowDown) {
        event.preventDefault()
        nextItem()
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        onSelect(activeIndex)
      }
    }

    if (!isMenuOpen) window?.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, items, isMenuOpen])

  if (!items || items.length === 0) {
    return (
      <FullWidth narrow={!!activeAction?.actionIds}>
        <NotFoundText>
          <Icon color={theme.colors.primary} fontSize={48} icon={LensIcon} />
          <p>No results!</p>
        </NotFoundText>
      </FullWidth>
    )
  }

  return (
    <RelativeList narrow={!!activeAction?.actionIds}>
      <Virtuoso
        tabIndex={-1}
        data={items}
        ref={parentRef}
        itemContent={(index, item) => {
          return (
            <ActionItem key={index} onClick={() => onSelect(index)}>
              <Row active={index === activeIndex} row={item.slice(0, ROW_ITEMS_LIMIT)} />
            </ActionItem>
          )
        }}
      />
    </RelativeList>
  )
}

export default List
