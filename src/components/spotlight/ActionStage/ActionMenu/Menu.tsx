import React, { useEffect, useMemo } from 'react'
import { useSpring } from 'react-spring'
import { MenuContainer, MenuBody, MenuHeader, Overlay, MenuTitle } from './styled'
import { groupBy } from 'lodash'
import { useActionMenuStore } from './useActionMenuStore'
import MenuDisplay from './MenuDisplay'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { useTheme } from 'styled-components'
import { MexIcon } from '@style/Layouts'
import { mog } from '@utils/lib/helper'

type MenuProps = {}

const Menu: React.FC<MenuProps> = () => {
  const activeAction = useActionStore()?.activeAction
  const activeMenuItem = useActionStore((store) => store.viewData)
  const setIsMenuOpen = useActionStore((store) => store.setIsMenuOpen)
  const clearMenuStore = useActionMenuStore((store) => store.clearMenuStore)
  const activeMenuAction = useActionMenuStore((store) => store.activeMenuAction)

  const theme = useTheme()

  const { getConfig, getConfigWithActionId } = useActionPerformer()

  const menuItems = useMemo(() => {
    const items = getConfigWithActionId(activeAction?.id)?.postAction?.menus

    const groupedItems = Object.values(groupBy(items, (item) => item.type)).flat()
    return groupedItems
  }, [activeAction])

  const transitions = useSpring({
    from: {
      width: '0'
    },
    to: {
      width: '20rem'
    }
  })

  const onOutsideClick = (e: any) => {
    setIsMenuOpen(false)
    clearMenuStore()
  }

  const header = useMemo(() => {
    const title = activeMenuItem?.display?.filter((item) => item.type === 'title')?.[0]
    const actionDetails = getConfig(activeAction?.actionGroupId, activeMenuAction?.actionId)

    return { subHeading: actionDetails?.name, heading: title }
  }, [activeMenuAction, activeMenuItem])

  useEffect(() => {
    return () => setIsMenuOpen(false)
  }, [])

  return (
    <Overlay tabIndex={0} onClick={onOutsideClick}>
      <MenuContainer style={transitions} id="wd-mex-action-menu" onClick={(e) => e.stopPropagation()}>
        <MenuHeader id="wd-mex-action-menu-heading">
          <MexIcon
            color={theme.colors.primary}
            icon={activeAction?.icon}
            height="1rem"
            width="1rem"
            margin="0 0.5rem"
          />
          <MenuTitle>{header?.heading?.value || header?.subHeading}</MenuTitle>
        </MenuHeader>
        <MenuBody id="wd-mex-action-menu-content">
          <MenuDisplay menuItems={menuItems} />
        </MenuBody>
      </MenuContainer>
    </Overlay>
  )
}

export default Menu
