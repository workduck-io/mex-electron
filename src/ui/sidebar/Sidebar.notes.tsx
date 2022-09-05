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
  const [index, setIndex] = useState(0)
  // const { getAllBookmarks } = useBookmarks()

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

  const currentSpace = spaces[index]
  // const onClick = useCallback(() => set(state => (state + 1) % 3), [])
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' }
  })

  useEffect(() => {
    transRef.start()
  }, [index])

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i]} style={style} />
        })}
      </SpaceContentWrapper>
      {/* currentSpace && <SidebarSpaceComponent style={} space={currentSpace} />*/}
      <SidebarSpaceSwitcher currentSpace={currentSpace.id} spaces={spaces} setCurrentIndex={setIndex} />
    </SpaceWrapper>
  )
}
