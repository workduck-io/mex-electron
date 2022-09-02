import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { CreateNewButton, SpaceItem, SpaceSwitcher, SwitcherSpaceItems } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentSpace: (id: string) => void
}

export const SidebarSpaceSwitcher = ({ currentSpace, spaces, setCurrentSpace }: SidebarSpaceSwitcherProps) => {
  return (
    <SpaceSwitcher>
      <SwitcherSpaceItems>
        {spaces.map((s) => (
          <SpaceItem
            active={currentSpace === s.id}
            onClick={() => setCurrentSpace(s.id)}
            key={`spaceSwitcher_item_${s.id}`}
          >
            <Icon icon={s.icon ?? 'heroicons-outline:view-grid'} />
          </SpaceItem>
        ))}
      </SwitcherSpaceItems>

      <CreateNewButton>
        <Icon icon={addCircleLine} />
      </CreateNewButton>
    </SpaceSwitcher>
  )
}
