import create from 'zustand'
import { SearchFilter } from './useFilters'

export interface View<Item> {
  title: string
  description?: string
  id: string
  filters: SearchFilter<Item>[]
}

export interface ViewStore<Item> {
  views: View<Item>[]
  currentView: View<Item> | undefined
  setCurrentView: (view: View<Item>) => void
  setViews: (views: View<Item>[]) => void
  addView: (view: View<Item>) => void
  removeView: (view: View<Item>) => void
  updateView: (view: View<Item>) => void
}

// export const useFilterStoreBase = create<FilterStore<any>>((set) => ({
//   filters: [],
//   currentFilters: [],
//   indexes: ['node', 'shared'],
//   setFilters: (filters) => set((state) => ({ ...state, filters })),
//   setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
//   setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
// }))

export const useViewStore = create<ViewStore<any>>((set) => ({
  views: [],
  currentView: undefined,
  setCurrentView: (view) =>
    set((state) => ({
      ...state,
      currentView: view
    })),
  setViews: (views) =>
    set((state) => ({
      ...state,
      views
    })),
  addView: (view) =>
    set((state) => ({
      ...state,
      views: [...state.views.filter((v) => v.id !== view.id), view]
    })),
  removeView: (view) =>
    set((state) => ({
      ...state,
      views: state.views.filter((v) => v.id !== view.id)
    })),
  updateView: (view) =>
    set((state) => ({
      ...state,
      views: state.views.map((v) => (v.id === view.id ? view : v))
    }))
}))
