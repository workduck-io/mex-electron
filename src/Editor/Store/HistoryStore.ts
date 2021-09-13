import create from 'zustand'
import { MAX_HISTORY_SIZE } from '../../Defaults/navigation'

export type HistoryType = {
  stack: string[]
  currentNodeIndex: number
  move: (distance: number) => void
  push: (id: string) => void
  replace: (id: string) => void
  update: (stack: string[], currentNodeIndex: number) => void
  getCurrentNodeId: () => string | undefined
}

export const useHistoryStore = create<HistoryType>((set, get) => ({
  stack: [],
  currentNodeIndex: -1,

  /**
   * Push will remove all elements above the currentNodeIndex
   */
  replace: (id) => {
    set((state) => {
      const historyStack = state.stack.slice(0)
      const lastElement = historyStack[historyStack.length - 1]

      if (lastElement === id) return
      historyStack[historyStack.length - 1] = id

      return {
        stack: historyStack
      }
    })
  },
  push: (id) =>
    set((state) => {
      let newIndex = state.currentNodeIndex + 1
      const remainingStack = state.stack.slice(0, newIndex)
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
        stack: resizedArr,
        currentNodeIndex: newIndex
      }
    }),

  move: (distance) =>
    set((state) => {
      const newIndex = state.currentNodeIndex + distance

      if (newIndex >= 0 && newIndex < state.stack.length) {
        return {
          currentNodeIndex: newIndex
        }
      }
    }),

  update: (stack, currentNodeIndex) =>
    set((state) => ({
      stack,
      currentNodeIndex
    })),

  getCurrentNodeId: (): string | undefined => {
    const curIndex = get().currentNodeIndex
    if (curIndex >= 0 && curIndex < get().stack.length) {
      return get().stack[curIndex]
    }
    return undefined
  }
}))
