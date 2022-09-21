import { isElder } from '@components/mex/Sidebar/treeUtils'
import { getReminderState } from '@services/reminders/reminders'
import useDataStore from '@store/useDataStore'
import { mog } from '@workduck-io/mex-utils'
import { useLinks } from './useLinks'

export const useGenericFilterFunctions = () => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  return {
    note: (item, value) => {
      // return true
      const itemPath = getPathFromNodeid(item.id)
      // mog('itemPath being filtered', { item, itemPath, path })
      return isElder(itemPath, value) || itemPath === value
    },
    tag: (item, value) => {
      const tagsCache = useDataStore.getState().tagsCache
      const tags = tagsCache[value]
      return tags && tags.nodes.includes(item.id)
    },
    space: (item, value) => {
      // mog('namespace', { item, value })
      const iLink = getILinkFromNodeid(item.id)
      const namespace = iLink?.namespace
      return namespace === value
    }
  }
}

export const reminderFilterFunctions = {
  note: (item, value) => {
    return item.nodeid === value
  },
  state: (item, value) => {
    const state = getReminderState(item)
    return state === value
  },
  has: (item, value) => {
    return item.todoid !== undefined
  }
}

export const useTaskFilterFunctions = () => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()

  return {
    note: (item, value) => {
      // filter: (item: TodoType) => {
      const itemPath = getPathFromNodeid(item.nodeid)
      if (!itemPath) return false
      // mog('itemPath being filtered', { item, itemPath, path })
      return isElder(itemPath, value) || itemPath === value
      // }
    },

    tag: (item, value) => {
      const tagsCache = useDataStore.getState().tagsCache
      const tag = tagsCache[value]
      // Check if the note of task has the tag
      return tag && tag.nodes.includes(item.nodeid)
    },

    mention: (item, value) => {
      return item.mentions?.includes(value)
    },

    space: (item, value) => {
      // mog('namespace', { item, value })
      const iLink = getILinkFromNodeid(item.nodeid)
      const namespace = iLink?.namespace
      return namespace === value
    }
  }
}
