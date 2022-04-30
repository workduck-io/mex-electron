import React, { useEffect, useRef, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import Row from './Row'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { NotFoundText } from '../../../../style/Form'
import { Icon } from '@iconify/react'
import { useActionStore } from '../../Actions/useActionStore'
import { useVirtual } from 'react-virtual'
import { ListItem } from '../../Home/styled'
import { KEYBOARD_KEYS } from '../../Home/components/List'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { NavigationType, useRouting } from '../../../../views/routes/urls'

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
  const { goTo } = useRouting()

  const parentRef = useRef(null)
  const virtualizer = useVirtual({
    size: items?.length ?? 0,
    parentRef
  })

  const onSelect = (i: any) => {
    setActiveIndex(i)
    setView('item')
    setViewData(items[i])
    goTo('/action/view', NavigationType.push)
  }

  const nextItem = () => {
    setActiveIndex((next) => {
      const nextIndex = (next + 1) % items.length
      scrollTo(nextIndex)
      return nextIndex
    })
  }

  const prevItem = () => {
    setActiveIndex((prev) => {
      const prevIndex = (prev - 1 + items.length) % items.length
      scrollTo(prevIndex)
      return prevIndex
    })
  }

  const scrollTo = (itemIndex: number) => virtualizer.scrollToIndex(itemIndex)

  useEffect(() => {
    const handler = (event) => {
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

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, items])

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
    <RelativeList ref={parentRef} narrow={!!activeAction?.actionIds}>
      {virtualizer.virtualItems.map((vItem, i) => {
        const item = items[vItem.index]
        return (
          <ListItem key={`TEMPLATE_${i}`} ref={vItem.measureRef} start={vItem.start} onClick={() => onSelect(i)}>
            <Row active={i === activeIndex} row={item.slice(0, ROW_ITEMS_LIMIT)} />
          </ListItem>
        )
      })}
    </RelativeList>
  )
}

export default List
