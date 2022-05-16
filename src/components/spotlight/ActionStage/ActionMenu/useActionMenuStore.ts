import create from 'zustand'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'

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

  // * Action Menu Modal state
  isActionMenuOpen: boolean
  toggleActionMenu: () => void
  setIsActionMenuOpen: (isActionMenuOpen: boolean) => void

  // * Clear
  clearMenuStore: () => void
}

const useActionMenuStore = create<MenuActionStoreProps>((set, get) => ({
  menuActions: [],
  setMenuActions: (menuActions) => set({ menuActions }),

  activeMenuAction: null,
  setActiveMenuAction: (activeMenuAction) => set({ activeMenuAction }),

  isActionMenuOpen: false,
  setIsActionMenuOpen: (isActionMenuOpen) => set({ isActionMenuOpen }),

  activeMenuForm: 0,
  setActiveMenuForm: (activeMenuForm) => set({ activeMenuForm }),
  toggleActionMenu: () => set({ isActionMenuOpen: !get().isActionMenuOpen }),

  clearMenuStore: () => set({ menuActions: [], activeMenuAction: null })
}))

export default useActionMenuStore
