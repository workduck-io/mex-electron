import { isElder } from '@components/mex/Sidebar/treeUtils'
import { getReminderState } from '@services/reminders/reminders'
import useDataStore from '@store/useDataStore'
import { FilterFunction, Filter, SearchFilterFunctions, FilterJoin } from '../types/filters'
import { mog } from '@workduck-io/mex-utils'
import { useLinks } from './useLinks'

const joinNewRes = (acc: boolean, curRes: boolean, join: FilterJoin) => {
  if (join === 'all') {
    return acc && curRes
  } else if (join === 'any') {
    return acc || curRes
  } else if (join === 'notAny') {
    return acc || !curRes
  } else if (join === 'none') {
    return acc && !curRes
  }
}

export const useGenericFilterFunctions = () => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const filterFunctions: SearchFilterFunctions = {
    note: (item: any, f: Filter) => {
      const { values, type, join } = f

      const val = Array.isArray(values) ? values : [values]
      const itemPath = getPathFromNodeid(item.id)

      const res = val.reduce((acc, v) => {
        // Merge with respect to join
        const curRes = isElder(itemPath, v.value) || itemPath === v.value
        return joinNewRes(acc, curRes, join)
      }, false)

      // const itemPath = getPathFromNodeid(item.id)
      // mog('itemPath being filtered', { item, itemPath, path })
      return res
    },

    tag: (item: any, f: Filter) => {
      const tagsCache = useDataStore.getState().tagsCache
      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]

      const res = val.reduce((acc, v) => {
        const curRes = tagsCache[v.value]?.nodes?.includes(item.id)
        return joinNewRes(acc, curRes, join)
      }, false)

      // const tags = tagsCache[value]
      return res
    },

    space: (item: any, f: Filter) => {
      // mog('namespace', { item, value })
      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]
      const iLink = getILinkFromNodeid(item.id)

      const res = val.reduce((acc, v) => {
        const curRes = iLink?.namespace === v.value
        return joinNewRes(acc, curRes, join)
      }, false)
      // const namespace = iLink?.namespace
      return res
    }
  }
  return filterFunctions
}

export const reminderFilterFunctions: SearchFilterFunctions = {
  note: (item, f) => {
    const { values, type, join } = f
    const val = Array.isArray(values) ? values : [values]
    const res = val.reduce((acc, v) => {
      const curRes = item.nodeid === v.value
      return joinNewRes(acc, curRes, join)
    }, false)
    return res
  },

  state: (item, f) => {
    const state = getReminderState(item)
    const { values, type, join } = f
    const val = Array.isArray(values) ? values : [values]
    const res = val.reduce((acc, v) => {
      const curRes = state === v.value
      return joinNewRes(acc, curRes, join)
    }, false)
    return res
  },

  has: (item, f) => {
    const { values, type, join } = f
    const val = Array.isArray(values) ? values : [values]
    const res = val.reduce((acc, v) => {
      const curRes = item.todoid !== undefined
      return joinNewRes(acc, curRes, join)
    }, false)
    return res
    // return item.todoid !== undefined
  }
}

export const useTaskFilterFunctions = (): SearchFilterFunctions => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()

  return {
    note: (item, f) => {
      // filter: (item: TodoType) => {
      const itemPath = getPathFromNodeid(item.nodeid)
      if (!itemPath) return false

      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]

      const res = val.reduce((acc, v) => {
        // Merge with respect to join
        const curRes = isElder(itemPath, v.value) || itemPath === v.value
        return joinNewRes(acc, curRes, join)
      }, false)

      // const itemPath = getPathFromNodeid(item.id)
      // mog('itemPath being filtered', { item, itemPath, path })
      return res
    },

    tag: (item, f) => {
      // const tagsCache = useDataStore.getState().tagsCache
      // const tag = tagsCache[value]
      // // Check if the note of task has the tag
      // return tag && tag.nodes.includes(item.nodeid)

      const tagsCache = useDataStore.getState().tagsCache
      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]

      const res = val.reduce((acc, v) => {
        const curRes = tagsCache[v.value]?.nodes?.includes(item.nodeid)
        return joinNewRes(acc, curRes, join)
      }, false)

      // const tags = tagsCache[value]
      return res
    },

    mention: (item, f) => {
      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]

      const res = val.reduce((acc, v) => {
        const curRes = item.mentions?.includes(v.value)
        return joinNewRes(acc, curRes, join)
      }, false)

      return res
    },

    space: (item, f) => {
      const { values, type, join } = f
      const val = Array.isArray(values) ? values : [values]
      const iLink = getILinkFromNodeid(item.nodeid)

      const res = val.reduce((acc, v) => {
        const curRes = iLink?.namespace === v.value
        return joinNewRes(acc, curRes, join)
      }, false)

      return res
    }
  }
}
