import React, { useEffect, useMemo, useRef } from 'react'
import { useSpring } from 'react-spring'
import { MenuContainer, MenuBody, MenuHeader, Overlay, MenuTitle } from './styled'
import { groupBy } from 'lodash'
import { useSpotlightAppStore } from '@store/app.spotlight'
import useActionMenuStore from './useActionMenuStore'
import MenuDisplay from './MenuDisplay'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { useTheme } from 'styled-components'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { MexIcon } from '@style/Layouts'

type MenuProps = {}

const Menu: React.FC<MenuProps> = () => {
  const activeMenuAction = useActionMenuStore((store) => store.activeMenuAction)
  const activeMenuItem = useSpotlightAppStore((store) => store.viewData)

  const theme = useTheme()

  const activeAction = useActionStore((store) => store.activeAction)
  const setIsMenuOpen = useSpotlightAppStore((store) => store.setIsMenuOpen)

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
      width: '38vw'
    }
  })

  const { activeItem } = useSpotlightContext()

  const header = useMemo(() => {
    const title = activeMenuItem?.display?.filter((item) => item.type === 'title')?.[0]
    const activeAction = useActionStore.getState().activeAction
    const actionDetails = getConfig(activeAction?.actionGroupId, activeMenuAction?.actionId)

    return { subHeading: actionDetails?.name, heading: title }
  }, [activeMenuAction, activeMenuItem])

  useEffect(() => {
    return () => setIsMenuOpen(false)
  }, [])

  return (
    <Overlay tabIndex={0} onClick={() => setIsMenuOpen(false)}>
      <MenuContainer style={transitions} id="wd-mex-action-menu">
        <MenuHeader id="wd-mex-action-menu-heading">
          <MexIcon
            color={theme.colors.primary}
            icon={activeItem?.item?.icon}
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
