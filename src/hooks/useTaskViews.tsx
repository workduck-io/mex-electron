import { useApi } from '@apis/useSaveApi'
import { mog } from '@utils/lib/helper'
import { useEffect } from 'react'
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
  removeView: (id: string) => void
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
  removeView: (id) =>
    set((state) => ({
      ...state,
      views: state.views.filter((v) => v.id !== id)
    })),
  updateView: (view) =>
    set((state) => ({
      ...state,
      views: state.views.map((v) => (v.id === view.id ? view : v))
    }))
}))

export const useTaskViews = () => {
  const addViewStore = useViewStore((store) => store.addView)
  const updateViewStore = useViewStore((store) => store.updateView)
  const removeViewStore = useViewStore((store) => store.removeView)
  const { saveView, deleteView: deleteViewApi } = useApi()

  const getView = (id: string) => {
    const views = useViewStore.getState().views
    return views.find((v) => v.id === id)
  }

  const addView = async (view: View<any>) => {
    const resp = await saveView(view)
    mog('After Svaing that view', { resp })
    addViewStore(view)
  }

  const updateView = async (view: View<any>) => {
    const resp = await saveView(view)
    mog('After update via saving that view', { resp })
    updateViewStore(view)
  }

  const deleteView = async (viewid: string) => {
    const resp = await deleteViewApi(viewid)
    mog('After deleting that view', { resp })
    removeViewStore(viewid)
  }

  return { getView, addView, updateView, deleteView }
}

// Used to sync views with backend
export const useSyncTaskViews = () => {
  const { getAllViews } = useApi()
  const setViews = useViewStore((store) => store.setViews)
  const fetchAndSetAllViews = async () => {
    try {
      const allViews = await getAllViews()
      mog('All Views', { allViews })
      setViews(allViews)
    } catch (e) {
      mog('Error fetching the views', { e })
    }
  }

  useEffect(() => {
    fetchAndSetAllViews()
  }, [])
}
