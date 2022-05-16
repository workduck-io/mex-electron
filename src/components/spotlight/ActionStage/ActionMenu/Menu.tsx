import React, { useEffect, useMemo } from 'react'
import { useSpring } from 'react-spring'
import { MenuContainer, MenuBody, MenuHeader, MenuFooter, Overlay, MenuTitle } from './styled'
import tinykeys from 'tinykeys'
import { useSpotlightAppStore } from '@store/app.spotlight'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
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
  const clearMenuStore = useActionMenuStore((store) => store.clearMenuStore)
  const activeMenuItem = useSpotlightAppStore((store) => store.viewData)

  const theme = useTheme()
  const activeAction = useActionStore((store) => store.activeAction)
  const setActiveMenuAction = useActionMenuStore((store) => store.setActiveMenuAction)
  const setIsMenuOpen = useSpotlightAppStore((store) => store.setIsMenuOpen)
  const { getConfig } = useActionPerformer()

  const menuItems = getConfig(activeAction?.actionGroupId, activeAction?.id)?.postAction?.menus

  const transitions = useSpring({
    from: {
      width: '0'
    },
    to: {
      width: '40vw'
    }
  })

  const executesMenuAction = (menuAction: MenuPostActionConfig) => (event) => {
    event.preventDefault()
    event.stopPropagation()

    setActiveMenuAction(menuAction)
  }

  const addMenuActionListener = (menuItems: Array<MenuPostActionConfig>) => {
    return menuItems.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.shortcut]: executesMenuAction(curr)
      }),
      {}
    )
  }

  useEffect(() => {
    // * Disable global keydown events
    setIsMenuOpen(true)

    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        event.stopPropagation()
      },
      Escape: (event) => {
        event.preventDefault()
        // * go back to previous step
      },
      ...addMenuActionListener(menuItems)
    })

    return () => {
      // * remove Menu listeners
      unsubscribe()

      // * Enable global keydown events
      setIsMenuOpen(false)
      clearMenuStore()
    }
  }, [])
  const { activeItem } = useSpotlightContext()

  const header = useMemo(() => {
    const title = activeMenuItem?.filter((item) => item.type === 'title')?.[0]
    const activeAction = useActionStore.getState().activeAction
    const actionDetails = getConfig(activeAction?.actionGroupId, activeMenuAction?.actionId)

    return { subHeading: actionDetails?.name, heading: title }
  }, [activeMenuAction, activeMenuItem])

  return (
    <Overlay onClick={() => setIsMenuOpen(false)}>
      <MenuContainer style={transitions} id="wd-mex-action-menu">
        <MenuHeader id="wd-mex-action-menu-heading">
          <MexIcon
            color={theme.colors.primary}
            icon={activeItem?.item?.icon}
            height="1rem"
            width="1rem"
            margin="0 1rem 0 0.5rem"
          />
          <MenuTitle>{header?.heading?.value || header?.subHeading}</MenuTitle>
        </MenuHeader>
        <MenuBody id="wd-mex-action-menu-content">
          <MenuDisplay menuItems={menuItems} />
        </MenuBody>
        {/* <MenuFooter id="wd-mex-action-menu-footer"> */}
        {/* <FormButton type="submit" form="menu-action-form" color={theme.colors.primary}></FormButton> */}
        {/* <Input autoFocus type="text" id="wd-mex-action-menu-search" placeholder="Search" /> */}
        {/* </MenuFooter> */}
      </MenuContainer>
    </Overlay>
  )
}

export default Menu
