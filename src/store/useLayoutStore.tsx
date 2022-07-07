import create from 'zustand'

export interface FocusMode {
  on: boolean
  hover: boolean
}

export type InfobarMode = 'default' | 'flow' | 'graph' | 'reminders' | 'suggestions'

interface LayoutState {
  sidebar: { expanded: boolean; show: boolean }
  infobar: { visible: boolean; mode: InfobarMode }
  focusMode: FocusMode
  toggleSidebar: () => void
  showSidebar: () => void
  hideSidebar: () => void
  toggleFocusMode: () => void
  setFocusMode: (focusMode: FocusMode) => void
  hoverFocusMode: () => void
  blurFocusMode: () => void
  toggleInfobar: () => void
  setInfobarMode: (mode: InfobarMode) => void
  showInfobar: () => void
  hideInfobar: () => void
  showLoader?: boolean
  setShowLoader?: (showLoader: boolean) => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Focus mode
  focusMode: { on: false, hover: false },
  toggleFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, on: !state.focusMode.on } })),
  setFocusMode: (focusMode) => set({ focusMode }),
  hoverFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: true } })),
  blurFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: false } })),

  showLoader: false,
  setShowLoader: (showLoader) => set({ showLoader }),

  // Sidebar
  sidebar: {
    expanded: true,
    show: false
  },
  toggleSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, expanded: !state.sidebar.expanded } })),
  showSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: true } })),
  hideSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: false } })),

  // Infobar
  infobar: {
    visible: true,
    mode: 'default'
  },
  setInfobarMode: (mode) => {
    const curMode = get().infobar.mode
    if (curMode === mode) return
    set({ infobar: { ...get().infobar, mode } })
  },
  toggleInfobar: () => set({ infobar: { ...get().infobar, visible: !get().infobar.visible } }),
  showInfobar: () => set({ infobar: { ...get().infobar, visible: true } }),
  hideInfobar: () => set({ infobar: { ...get().infobar, visible: false } })
}))
