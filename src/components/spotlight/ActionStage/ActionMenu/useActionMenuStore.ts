import create from 'zustand'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import createContext from 'zustand/context'

type MenuActionStoreProps = {
  // * All active action's menu actions
  menuActions: Array<MenuPostActionConfig>
  setMenuActions: (menuActions: Array<MenuPostActionConfig>) => void

  // * Active Menu action
  activeMenuAction: MenuPostActionConfig
  setActiveMenuAction: (activeMenuAction: MenuPostActionConfig) => void

  // * Action menu form
  activeMenuForm: number
  setActiveMenuForm: (activeMenuForm: number) => void

  // Explicitly refresh current action
  needsRefresh: boolean
  setNeedsRefresh: () => void

  // * If no items present hide menu button
  hideMenu?: boolean
  setHideMenu: (hideMenu: boolean) => void

  // * Action Menu Modal state
  isActionMenuOpen: boolean
  toggleActionMenu: () => void
  setIsActionMenuOpen: (isActionMenuOpen: boolean) => void

  // * Clear
  clearMenuStore: () => void
}

export const { Provider: MenuProvider, useStore: useActionMenuStore } = createContext<MenuActionStoreProps>()

export const actionMenuStore = () =>
  create<MenuActionStoreProps>((set, get) => ({
    menuActions: [],
    setMenuActions: (menuActions) => set({ menuActions }),

    needsRefresh: false,
    setNeedsRefresh: () => set({ needsRefresh: !get().needsRefresh }),

    activeMenuAction: null,
    setActiveMenuAction: (activeMenuAction) => set({ activeMenuAction }),

    isActionMenuOpen: false,
    setIsActionMenuOpen: (isActionMenuOpen) => set({ isActionMenuOpen }),

    hideMenu: false,
    setHideMenu: (hideMenu) => set({ hideMenu }),

    activeMenuForm: 0,
    setActiveMenuForm: (activeMenuForm) => set({ activeMenuForm }),
    toggleActionMenu: () => set({ isActionMenuOpen: !get().isActionMenuOpen }),

    clearMenuStore: () => set({ menuActions: [], activeMenuAction: null, isActionMenuOpen: false, activeMenuForm: 0 })
  }))
