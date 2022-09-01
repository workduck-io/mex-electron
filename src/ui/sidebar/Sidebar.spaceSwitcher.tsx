import React from 'react'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentSpace: (id: string) => void
}

export const SidebarSpaceSwitcher = ({ currentSpace, spaces, setCurrentSpace }: SidebarSpaceSwitcherProps) => {
  return (
    <div>
      {spaces.map((s) => (
        <div onClick={() => setCurrentSpace(s.id)} key={`spaceSwitcher_item_${s.id}`}>
          {s.label}
        </div>
      ))}
      <div>Create new Menu button</div>
    </div>
  )
}
