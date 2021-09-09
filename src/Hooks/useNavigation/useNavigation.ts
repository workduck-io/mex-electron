import { useEditorStore } from '../../Editor/Store/EditorStore'
import create from 'zustand'

interface NavigationState {
  history: {
    stack: string[]
    currentNodeIndex: number
    move: (distance: number) => void
    push: (id: string) => void
    clear: () => void
    getCurrentNodeId: () => string | undefined
  }
  recents: {
    last10: string[]
    addRecent: (id: string) => void
  }
}

export const useNavigationState = create<NavigationState>((set, get) => ({
  history: {
    stack: [],
    currentNodeIndex: -1,

    /**
     * Push will remove all elements above the currentNodeIndex
     */
    push: (id) =>
      set((state) => {
        const newIndex = state.history.currentNodeIndex + 1
        const remainingStack = state.history.stack.slice(0, newIndex)
        remainingStack.push(id)
        return {
          history: {
            ...state.history,
            stack: remainingStack,
            currentNodeIndex: newIndex
          }
        }
      }),

    move: (distance) =>
      set((state) => {
        const newIndex = state.history.currentNodeIndex + distance

        if (newIndex >= 0 && newIndex < state.history.stack.length) {
          return {
            history: {
              ...state.history,
              currentNodeIndex: newIndex
            }
          }
        }
      }),

    clear: () =>
      set((state) => ({
        history: { ...state.history, stack: [], currentNodeIndex: -1 }
      })),

    getCurrentNodeId: (): string | undefined => {
      const curIndex = get().history.currentNodeIndex
      if (curIndex >= 0 && curIndex < get().history.stack.length) {
        return get().history.stack[curIndex]
      }
      return undefined
    }
  },

  recents: {
    last10: [],
    addRecent: (id: string) =>
      set((state) => ({
        recents: {
          ...state.recents,
          last10: [...state.recents.last10.slice(-9), id]
        }
      }))
  }
}))

export const useNavigation = () => {
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const pushHs = useNavigationState((store) => store.history.push)
  const moveHs = useNavigationState((store) => store.history.move)
  const addRecent = useNavigationState((store) => store.recents.addRecent)
  const getCurrentNodeId = useNavigationState((store) => store.history.getCurrentNodeId)

  const push = (id: string) => {
    pushHs(id)
    addRecent(id)
    loadNodeFromId(id)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentNodeId()
    if (newId) {
      loadNodeFromId(newId)
      addRecent(newId)
    }
    return newId
  }

  return { push, move }
}
