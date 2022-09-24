import { GlobalFilterJoin } from '../../../types/filters'
import React from 'react'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { GenericSection } from './Filter.style'
import { getFilterJoinIcon } from '@hooks/ui/useFilterValueIcons'
import IconDisplay from '../IconPicker/IconDisplay'

interface GlobalJoinFilterMenuProps {
  globalJoin: GlobalFilterJoin
  setGlobalJoin: (join: GlobalFilterJoin) => void
}

const GlobalJoinFilterMenu = ({ globalJoin, setGlobalJoin }: GlobalJoinFilterMenuProps) => {
  return (
    <Menu
      values={
        <GenericSection>
          <IconDisplay icon={getFilterJoinIcon(globalJoin)} />
          {globalJoin === 'any' ? 'Any' : 'All'} filters
        </GenericSection>
      }
    >
      <MenuItem icon={getFilterJoinIcon('all')} onClick={() => setGlobalJoin('all')} label={'All'} />
      <MenuItem icon={getFilterJoinIcon('any')} onClick={() => setGlobalJoin('any')} label={'Any'} />
    </Menu>
  )
}

export default GlobalJoinFilterMenu
