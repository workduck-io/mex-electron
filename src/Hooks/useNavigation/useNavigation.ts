import { useEditorStore } from '../../Editor/Store/EditorStore'
import create from 'zustand'
import { remove } from 'lodash'
import { MAX_HISTORY_SIZE, MAX_RECENT_SIZE } from '../../Defaults/navigation'

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
    lastOpened: string[]
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
        let newIndex = state.history.currentNodeIndex + 1
        const remainingStack = state.history.stack.slice(0, newIndex)
        // Don't append if same as current id
        if (remainingStack[remainingStack.length - 1] === id) return
        remainingStack.push(id)
        // Update index if large
        if (remainingStack.length > MAX_HISTORY_SIZE) {
          newIndex = MAX_HISTORY_SIZE - 1
        }
        // Trim till the last 25
        const resizedArr = remainingStack.slice(-MAX_HISTORY_SIZE)
        return {
          history: {
            ...state.history,
            stack: resizedArr,
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
    lastOpened: [],
    addRecent: (id: string) => {
      // We move the id to the top if the id is present
      // swapping can increase performance
      const oldLast10 = Array.from(new Set(get().recents.lastOpened))
      if (oldLast10.includes(id)) {
        remove(oldLast10, (item) => item === id)
      }
      set((state) => ({
        recents: {
          ...state.recents,
          lastOpened: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), id]
        }
      }))
    }
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
