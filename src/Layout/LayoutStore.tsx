import create from 'zustand'

interface LayoutState {
  sidebar: { visible: boolean; width: number }
  infobar: { visible: boolean }
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  toggleInfobar: () => void
  showInfobar: () => void
  hideInfobar: () => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebar: {
    width: 300,
    visible: true
  },
  toggleSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, visible: !state.sidebar.visible } })),
  setSidebarWidth: (width) => set((state) => ({ sidebar: { ...state.sidebar, width } })),
  infobar: {
    visible: true
  },
  toggleInfobar: () => set((state) => ({ infobar: { visible: !state.infobar.visible } })),
  showInfobar: () => set({ infobar: { visible: true } }),
  hideInfobar: () => set({ infobar: { visible: false } })
}))
