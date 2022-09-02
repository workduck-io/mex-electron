import { SharedNodeIconify } from '@components/icons/Icons'
import Bookmarks from '@components/mex/Sidebar/Bookmarks'
import SharedNotes from '@components/mex/Sidebar/SharedNotes'
import { useBookmarks } from '@hooks/useBookmarks'
import { useLinks } from '@hooks/useLinks'
import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import useDataStore from '@store/useDataStore'
import { useLayoutStore } from '@store/useLayoutStore'
import React, { useMemo, useState } from 'react'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const bookmarks = useDataStore((store) => store.bookmarks)
  // const { getAllBookmarks } = useBookmarks()

  const [openedSpace, setOpenedSpace] = useState<string>('personal')

  const { getPathFromNodeid } = useLinks()

  const bookmarkItems = bookmarks
    .map((nodeid) => ({
      id: nodeid,
      label: getPathFromNodeid(nodeid),
      icon: bookmarkLine
    }))
    .filter((item) => item.label !== undefined)

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

  // usePolling()

  return (
    <SpaceWrapper>
      {currentSpace && <SidebarSpaceComponent space={currentSpace} />}
      <SidebarSpaceSwitcher currentSpace={openedSpace} spaces={spaces} setCurrentSpace={setOpenedSpace} />
    </SpaceWrapper>
  )
}
