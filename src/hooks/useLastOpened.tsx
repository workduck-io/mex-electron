import { useUserPropertiesStore } from '@services/user/userProperties'
import { getInitialNode } from '@utils/helpers'
import { mog } from '@utils/lib/helper'
import { debounce } from 'lodash'
import { useCallback } from 'react'

const DEBOUNCE_TIME = 3000

/**
 * Hook to update the last opened timestamp of a node
 */
export const useLastOpened = () => {
  /**
   * Update the last opened timestamp of a node
   * The current timestamp is used as the last opened timestamp
   */
  const addLastOpened = (nodeId: string) => {
    const lastOpenedNotes = useUserPropertiesStore.getState().lastOpenedNotes
    const mutedNotes = useUserPropertiesStore.getState().mutedNotes
    const initNode = getInitialNode()
    if (mutedNotes.includes(nodeId) || nodeId === initNode.nodeid) {
      return
    }
    // This replaces any previous timestamp with the current timestamp
    lastOpenedNotes[nodeId] = Date.now()
    mog('addLastOpened', { nodeId, lastOpenedNotes, mutedNotes })
    useUserPropertiesStore.setState({ lastOpenedNotes })
  }

  // Callback so that the debounced function is only generated once
  const debouncedAddLastOpened = useCallback(debounce(addLastOpened, DEBOUNCE_TIME, { trailing: true }), [])

  return { addLastOpened, debouncedAddLastOpened }
}
