import create from 'zustand'

interface VisibilityState {
  visible: boolean
}

interface LayoutState {
  sidebar: VisibilityState
  infobar: VisibilityState
  toggleSidebar: () => void
  toggleInfobar: () => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebar: {
    visible: true
  },
  toggleSidebar: () => set((state) => ({ sidebar: { visible: !state.sidebar.visible } })),

  infobar: {
    visible: true
  },
  toggleInfobar: () => set((state) => ({ infobar: { visible: !state.infobar.visible } }))
}))
