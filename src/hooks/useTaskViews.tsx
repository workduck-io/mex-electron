import create from 'zustand'
import { SearchFilter } from './useFilters'

export interface View<Item> {
  title: string
  id: string
  filters: SearchFilter<Item>[]
}

export interface ViewStore<Item> {
  views: View<Item>[]
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
