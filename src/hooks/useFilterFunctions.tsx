import { isElder } from '@components/mex/Sidebar/treeUtils'
import { getReminderState } from '@services/reminders/reminders'
import useDataStore from '@store/useDataStore'
import { mog } from '@workduck-io/mex-utils'
import { Filter, FilterJoin, FilterValue, SearchFilterFunctions } from '../types/filters'
import { useLinks } from './useLinks'

const joinNewRes = (acc: boolean, curRes: boolean, join: FilterJoin) => {
  if (join === 'all') {
    return acc && curRes
  } else if (join === 'any') {
    return acc || curRes
  } else if (join === 'notAny') {
    return acc || curRes
  } else if (join === 'none') {
    return acc && curRes
  }
}

const joinStartVal = (join: FilterJoin) => {
  if (join === 'all') {
    return true
  } else if (join === 'any') {
    return false
  } else if (join === 'notAny') {
    return false
  } else if (join === 'none') {
    return true
  }
}

const finalJoin = (join: FilterJoin, res: boolean) => {
  if (join === 'all' || join === 'any') {
    return res
  }
  if (join === 'notAny') {
    return !res
  }
  if (join === 'none') {
    return !res
  }
  return res
}

const joinReduce = (val: FilterValue[], join: FilterJoin, cond: (v: FilterValue) => boolean): boolean =>
  val.length > 0
    ? finalJoin(
        join,
        val.reduce((acc, v) => {
          const curRes = cond(v)
          // Merge with respect to join
          return joinNewRes(acc, curRes, join)
        }, joinStartVal(join))
      )
    : true

// Nice cool function
// Apply the match condition and join the results according to FilterJoin
const filterAndJoin = (filter: Filter, cond: (v: FilterValue) => boolean): boolean => {
  const { join, values } = filter
  // Put single values in array
  const val = Array.isArray(values) ? values : [values]
  return joinReduce(val, join, cond)
}

export const useGenericFilterFunctions = () => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const filterFunctions: SearchFilterFunctions = {
    note: (item: any, f: Filter) => {
      const itemPath = getPathFromNodeid(item.id)
      const res = filterAndJoin(f, (v) => isElder(itemPath, v.value) || itemPath === v.value)
      return res
    },

    tag: (item: any, f: Filter) => {
      const tagsCache = useDataStore.getState().tagsCache
      const res = filterAndJoin(f, (v) => tagsCache[v.value]?.nodes.includes(item.id))
      return res
    },

    space: (item: any, f: Filter) => {
      // mog('namespace', { item, value })
      const iLink = getILinkFromNodeid(item.id)
      const res = filterAndJoin(f, (v) => iLink?.namespace === v.value)
      return res
    }
  }
  return filterFunctions
}

export const reminderFilterFunctions: SearchFilterFunctions = {
  note: (item, f) => {
    const res = filterAndJoin(f, (v) => item.nodeid === v.value)
    return res
  },

  state: (item, f) => {
    const state = getReminderState(item)
    const res = filterAndJoin(f, (v) => state === v.value)
    return res
  },

  has: (item, f) => {
    const res = filterAndJoin(f, (v) => item.todo !== undefined)
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

      const res = filterAndJoin(f, (v) => isElder(itemPath, v.value) || itemPath === v.value)
      return res
    },

    tag: (item, f) => {
      const res = filterAndJoin(f, (v) => item.tags?.includes(v.value))
      return res
    },

    mention: (item, f) => {
      const res = filterAndJoin(f, (v) => item.mentions?.includes(v.value))
      return res
    },

    space: (item, f) => {
      const iLink = getILinkFromNodeid(item.nodeid)
      const res = filterAndJoin(f, (v) => iLink?.namespace === v.value)
      return res
    }
  }
}
