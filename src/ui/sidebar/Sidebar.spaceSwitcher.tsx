import { Tooltip } from '@components/FloatingElements/Tooltip'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
import { useLayoutStore } from '@store/useLayoutStore'
import React from 'react'
import { CreateNewMenu } from './Sidebar.createNew'
import { CreateNewButton, SpaceItem, SpaceSwitcher, SwitcherSpaceItems } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentIndex: (index: number) => void
}

export const SidebarSpaceSwitcher = ({ currentSpace, spaces, setCurrentIndex }: SidebarSpaceSwitcherProps) => {
  const sidebarWidth = useLayoutStore((s) => s.sidebar.width)
  return (
    <SpaceSwitcher>
      <SwitcherSpaceItems>
        {spaces.map((s, index) => (
          <Tooltip key={`spaceSwitcherItem_${s.id}`} content={s.label}>
            <SpaceItem
              sidebarWidth={sidebarWidth}
              totalItems={spaces.length}
              active={s.id === currentSpace}
              onClick={() => setCurrentIndex(index)}
            >
              <Icon icon={s.icon ?? 'heroicons-outline:view-grid'} />
            </SpaceItem>
          </Tooltip>
        ))}
      </SwitcherSpaceItems>

      <CreateNewMenu>
        <CreateNewButton>
          <Icon icon={addCircleLine} />
        </CreateNewButton>
      </CreateNewMenu>
    </SpaceSwitcher>
  )
}
