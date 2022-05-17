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
import { mog } from '@utils/lib/helper'
import useActionMenuStore from '../ActionMenu/useActionMenuStore'

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
  context: Array<any>
}

export const ROW_ITEMS_LIMIT = 7

const List: React.FC<ListProps> = ({ items, context }) => {
  const theme = useTheme()
  const activeAction = useActionStore((store) => store.activeAction)
  const [activeIndex, setActiveIndex] = useState(0)
  const setViewData = useSpotlightAppStore((store) => store.setViewData)
  const setView = useSpotlightAppStore((store) => store.setView)
  const isMenuOpen = useSpotlightAppStore((store) => store.isMenuOpen)
  const isActionMenuOpen = useActionMenuStore((store) => store.isActionMenuOpen)

  const { goTo } = useRouting()

  const parentRef = useRef(null)

  const setViewItemContext = (i: number) => {
    setViewData({
      display: items[i],
      context: context[i]
    })
  }

  const onSelect = (i: any) => {
    setActiveIndex(i)
    setView('item')
    setViewItemContext(i)
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

  const scrollTo = (itemIndex: number) => {
    parentRef?.current?.scrollToIndex({
      index: itemIndex,
      align: 'start',
      behavior: 'smooth'
    })
    setViewItemContext(itemIndex)
  }

  useEffect(() => {
    if (items && items.length > 0) {
      scrollTo(0)
    }
  }, [items])

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
        case KEYBOARD_KEYS.Enter:
          event.preventDefault()
          event.stopPropagation()
          onSelect(activeIndex)
          break
        default:
          break
      }
    }

    if (isMenuOpen || isActionMenuOpen) window?.removeEventListener('keydown', handler)
    else window?.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, items, isMenuOpen, isActionMenuOpen])

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
        key="wd-mex-action-result-list"
        id="wd-mex-action-result-list"
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
