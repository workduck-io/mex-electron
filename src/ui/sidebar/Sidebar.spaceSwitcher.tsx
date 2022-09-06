import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
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
  return (
    <SpaceSwitcher>
      <SwitcherSpaceItems>
        {spaces.map((s, index) => (
          <SpaceItem
            active={currentSpace === s.id}
            onClick={() => setCurrentIndex(index)}
            key={`spaceSwitcher_item_${s.id}`}
          >
            <Icon icon={s.icon ?? 'heroicons-outline:view-grid'} />
          </SpaceItem>
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
