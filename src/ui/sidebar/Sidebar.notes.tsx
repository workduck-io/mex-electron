import { SharedNodeIconify } from '@components/icons/Icons'
import Bookmarks from '@components/mex/Sidebar/Bookmarks'
import SharedNotes from '@components/mex/Sidebar/SharedNotes'
import useDataStore from '@store/useDataStore'
import React, { useMemo, useState } from 'react'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  // const { getAllBookmarks } = useBookmarks()

  const [openedSpace, setOpenedSpace] = useState<string>('personal')

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

  const currentSpace = spaces.find((space) => space.id === openedSpace)

  return (
    <SpaceWrapper>
      {currentSpace && <SidebarSpaceComponent space={currentSpace} />}
      <SidebarSpaceSwitcher currentSpace={openedSpace} spaces={spaces} setCurrentSpace={setOpenedSpace} />
    </SpaceWrapper>
  )
}
