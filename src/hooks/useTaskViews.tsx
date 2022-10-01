import { useEffect } from 'react'

import { useApi } from '@apis/useSaveApi'
import { mog } from '@utils/lib/helper'
import create from 'zustand'

import { Filter, GlobalFilterJoin } from '../types/filters'

export interface View {
  title: string
  description?: string
  id: string

  filters: Filter[]

  globalJoin: GlobalFilterJoin
}

export interface ViewStore {
  views: View[]
  currentView: View | undefined
  setCurrentView: (view: View) => void
  setViews: (views: View[]) => void
  addView: (view: View) => void
  removeView: (id: string) => void
  updateView: (view: View) => void
}

export const useViewStore = create<ViewStore>((set) => ({
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

  const addView = async (view: View) => {
    const resp = await saveView(view)
    // mog('After Svaing that view', { resp })
    addViewStore(view)
  }

  const updateView = async (view: View) => {
    const resp = await saveView(view)
    // mog('After update via saving that view', { resp })
    updateViewStore(view)
  }

  const deleteView = async (viewid: string) => {
    const resp = await deleteViewApi(viewid)
    // mog('After deleting that view', { resp })
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
      if (allViews !== undefined) {
        mog('All Views', { allViews })
        setViews(allViews)
      }
    } catch (e) {
      mog('Error fetching the views', { e })
    }
  }

  useEffect(() => {
    fetchAndSetAllViews()
  }, [])
}
