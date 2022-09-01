import useDataStore from '@store/useDataStore'
import { useLayoutStore } from '@store/useLayoutStore'
import React, { useMemo, useState } from 'react'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SidebarSpace } from './Sidebar.types'

export const NoteSidebar = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const ilinks = useDataStore((store) => store.ilinks)
  const [openedSpace, setOpenedSpace] = useState<string>('personal')

  const spaces: Array<SidebarSpace> = useMemo(
    () => [
      {
        id: 'personal',
        label: 'Personal',
        tooltip: 'All Notes',
        list: {
          type: 'hierarchy',
          items: ilinks
        },
        popularTags: ['Mex', 'Onboarding'],
        pinnedItems: []
      },
      {
        id: 'shared',
        label: 'Shared Notes',
        tooltip: 'Shared Notes',
        list: {
          type: 'flat',
          items: []
        },
        pinnedItems: []
      }
    ],
    []
  )

  const currentSpace = spaces.find((space) => space.id === openedSpace)

  // usePolling()

  return (
    <div>
      {currentSpace && <SidebarSpaceComponent space={currentSpace} />}
      <SidebarSpaceSwitcher currentSpace={openedSpace} spaces={spaces} setCurrentSpace={setOpenedSpace} />
    </div>
  )
}
