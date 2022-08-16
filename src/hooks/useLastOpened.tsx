import { useUserPropertiesStore } from '@services/user/userProperties'
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
    mog('addLastOpened', { nodeId })
    const lastOpenedNotes = useUserPropertiesStore.getState().lastOpenedNotes
    const mutedNotes = useUserPropertiesStore.getState().mutedNotes
    if (mutedNotes.includes(nodeId)) {
      return
    }
    // This replaces any previous timestamp with the current timestamp
    lastOpenedNotes[nodeId] = Date.now()
    useUserPropertiesStore.setState({ lastOpenedNotes })
  }

  // Callback so that the debounced function is only generated once
  const debouncedAddLastOpened = useCallback(debounce(addLastOpened, DEBOUNCE_TIME, { trailing: true }), [])

  return { addLastOpened, debouncedAddLastOpened }
}
