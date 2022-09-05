import { SharedNodeIconify } from '@components/icons/Icons'
import Bookmarks from '@components/mex/Sidebar/Bookmarks'
import SharedNotes from '@components/mex/Sidebar/SharedNotes'
import useDataStore from '@store/useDataStore'
import React, { useEffect, useMemo, useState } from 'react'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { useTransition, useSpringRef } from '@react-spring/web'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const [index, setIndex] = useState({ current: 0, prev: -1 })
  // Required to find direction of the animation
  // const { getAllBookmarks } = useBookmarks()
  //
  const changeIndex = (newIndex: number) => {
    if (newIndex === index.current) return
    setIndex((s) => ({ current: newIndex, prev: s.current }))
  }

  // const [openedSpace, setOpenedSpace] = useState<string>('personal')

  const spaces: Array<SidebarSpace> = useMemo(
    () => [
      {
        id: 'personal',
        label: 'Personal',
        icon: 'ri:user-line',
        tooltip: 'All Notes',
        list: {
          type: 'hierarchy',
          items: ilinks
        },
        pinnedItems: () => <Bookmarks />
      },
      {
        id: 'shared',
        label: 'Shared Notes',
        tooltip: 'Shared Notes',
        icon: SharedNodeIconify,
        list: {
          type: 'flat',
          renderItems: () => <SharedNotes />
        }
      }
    ],
    []
  )

  const currentSpace = spaces[index.current]
  // const onClick = useCallback(() => set(state => (state + 1) % 3), [])
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: (item) => {
      // console.log({ item })
      const direction = Math.sign(item.current - item.prev)
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: (item) => {
      // console.log({ item })
      const direction = Math.sign(item.current - item.prev)
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    }
  })

  useEffect(() => {
    transRef.start()
  }, [index])

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} />
        })}
      </SpaceContentWrapper>
      {/* currentSpace && <SidebarSpaceComponent style={} space={currentSpace} />*/}
      <SidebarSpaceSwitcher currentSpace={currentSpace.id} spaces={spaces} setCurrentIndex={changeIndex} />
    </SpaceWrapper>
  )
}
