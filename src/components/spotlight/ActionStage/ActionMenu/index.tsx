import React, { useEffect, useMemo } from 'react'
import Default from './Default'
import Menu from './Menu'
import tinykeys from 'tinykeys'
import { groupBy } from 'lodash'
import useActionMenuStore from './useActionMenuStore'
import { useMenuPerformer } from './useMenuPerfomer'
import { useSpotlightAppStore } from '@store/app.spotlight'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { mog } from '@utils/lib/helper'

type ActionMenuProps = {
  title: string
  shortcut?: string
}

const ActionMenu: React.FC<ActionMenuProps> = ({ title, shortcut }) => {
  const isOpen = useActionMenuStore((store) => store.isActionMenuOpen)
  const setIsMenuOpen = useSpotlightAppStore((store) => store.setIsMenuOpen)
  const toggleActionMenu = useActionMenuStore((store) => store.toggleActionMenu)
  const setActiveMenuAction = useActionMenuStore((store) => store.setActiveMenuAction)
  const setIsActiveMenuOpen = useActionMenuStore((store) => store.setIsActionMenuOpen)

  const activeAction = useActionStore((store) => store.activeAction)

  const { getConfigWithActionId } = useActionPerformer()

  const menuItems = useMemo(() => {
    const items = getConfigWithActionId(activeAction?.id)?.postAction?.menus

    const groupedItems = Object.values(groupBy(items, (item) => item.type)).flat()
    return groupedItems
  }, [activeAction])

  const { runAction } = useMenuPerformer()

  const executesMenuAction = (menuAction: MenuPostActionConfig) => (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!useActionMenuStore.getState().activeMenuAction) {
      runAction(menuAction)
    }
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
    const unsubscribe = tinykeys(window, {
      '$mod+K': (event) => {
        event.preventDefault()
        setIsMenuOpen(false)
        toggleActionMenu()
      },
      Tab: (event) => {
        if (!isOpen) return
        event.preventDefault()
        event.stopPropagation()
      },
      Escape: (event) => {
        if (!isOpen) return
        event.preventDefault()
        event.stopPropagation()
        const activeMenuAction = useActionMenuStore.getState().activeMenuAction

        // * go back to previous step
        if (activeMenuAction) {
          setActiveMenuAction(undefined)
        } else {
          setIsActiveMenuOpen(false)
        }
      },
      ...addMenuActionListener(menuItems)
    })

    return () => {
      // * remove Menu listeners
      unsubscribe()
    }
  }, [isOpen])

  if (!isOpen) return <Default title={title} shortcut={shortcut} />

  return <Menu />
}

export default ActionMenu
