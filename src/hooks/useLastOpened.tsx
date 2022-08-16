import { useUserPropertiesStore } from '@store/userPropertiesStore'
import { LastOpenedNote, LastOpenedState } from '../types/userProperties'
import { getInitialNode } from '@utils/helpers'
import { mog } from '@utils/lib/helper'
import { debounce } from 'lodash'
import { useCallback } from 'react'

const DEBOUNCE_TIME = 3000

const INIT_LAST_OPENED = {
  freq: 0,
  timestamp: 0,
  muted: false
}

export const getLastOpenedState = (updatedAt: number, lastOpenedNote: LastOpenedNote): LastOpenedState => {
  if (lastOpenedNote.muted) {
    return LastOpenedState.MUTED
  } else if (updatedAt > lastOpenedNote.timestamp) {
    return LastOpenedState.UNREAD
  } else if (updatedAt < lastOpenedNote.timestamp) {
    return LastOpenedState.OPENED
  } else {
    // Default to unread
    return LastOpenedState.UNREAD
  }
}

/**
 * Hook to update the last opened timestamp of a node
 */
export const useLastOpened = () => {
  const setLastOpenedNotes = useUserPropertiesStore((state) => state.setLastOpenedNotes)
  /**
   * Update the last opened timestamp of a node
   * The current timestamp is used as the last opened timestamp
   */
  const addLastOpened = (nodeId: string) => {
    const lastOpenedNotes = useUserPropertiesStore.getState().lastOpenedNotes
    const initNode = getInitialNode()
    if (nodeId === initNode.nodeid) {
      return
    }
    const lastOpenedNote = lastOpenedNotes[nodeId] || { nodeid: nodeId, ...INIT_LAST_OPENED }
    // This replaces any previous timestamp with the current timestamp
    const newLastOpenedNotes = {
      ...lastOpenedNotes,
      [nodeId]: {
        ...lastOpenedNote,
        timestamp: Date.now(),
        freq: lastOpenedNote.freq + 1
      }
    }
    mog('addLastOpened', { nodeId, lastOpenedNotes })
    setLastOpenedNotes(newLastOpenedNotes)
  }

  const setMuteNode = (nodeId: string, muted: boolean) => {
    const lastOpenedNotes = useUserPropertiesStore.getState().lastOpenedNotes
    const lastOpenedNote = lastOpenedNotes[nodeId] || { nodeid: nodeId, ...INIT_LAST_OPENED }
    const newLastOpenedNotes = {
      ...lastOpenedNotes,
      [nodeId]: {
        ...lastOpenedNote,
        muted
      }
    }
    mog('setMuteNode', { nodeId, muted, newLastOpenedNotes })
    setLastOpenedNotes(newLastOpenedNotes)
  }

  const muteNode = (nodeId: string) => {
    setMuteNode(nodeId, true)
  }
  const unmuteNode = (nodeId: string) => {
    setMuteNode(nodeId, false)
  }

  // Callback so that the debounced function is only generated once
  const debouncedAddLastOpened = useCallback(debounce(addLastOpened, DEBOUNCE_TIME, { trailing: true }), [])

  return { addLastOpened, debouncedAddLastOpened, muteNode, unmuteNode }
}
