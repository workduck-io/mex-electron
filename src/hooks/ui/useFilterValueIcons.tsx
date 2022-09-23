import useDataStore from '@store/useDataStore'
import { MIcon } from '../../types/Types'
import { FilterJoin, FilterJoinArray, FilterType } from '../../types/filters'
import { mog } from '@workduck-io/mex-utils'

export const getFilterJoinIcon = (join: FilterJoin): MIcon => {
  mog('getTagFilterValueIcon', { join })
  switch (join) {
    case 'all':
      return { type: 'ICON', value: 'material-symbols:join-inner' }
    case 'any':
      return { type: 'ICON', value: 'material-symbols:join-full' }
    case 'notAny':
      return { type: 'ICON', value: 'material-symbols:join-outline' }
    case 'none':
      return { type: 'ICON', value: 'carbon:join-outer' }

    default:
      return { type: 'ICON', value: 'material-symbols:join-outline' }
  }
}

export const useFilterIcons = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const namespaces = useDataStore((state) => state.namespaces)

  const getFilterValueIcon = (type: FilterType, value: string): MIcon => {
    switch (type) {
      case 'space': {
        const namespace = namespaces.find((n) => n.id === value)
        if (namespace) {
          return namespace.icon
        }
        return { type: 'ICON', value: 'ri:folder-2-line' }
      }

      case 'note': {
        const ilink = ilinks.find((ilink) => ilink.nodeid === value)
        if (ilink) {
          return { type: 'ICON', value: ilink.icon }
        }
        return { type: 'ICON', value: 'ri:file-list-2-line' }
      }

      case 'mention':
        return { type: 'ICON', value: 'ri:at-line' }

      case 'tag':
        return { type: 'ICON', value: 'ri:hashtag' }

      case 'date':
        return { type: 'ICON', value: 'ri:calendar-2-line' }

      case 'state':
        return { type: 'ICON', value: 'ri:checkbox-circle-line' }

      case 'has':
        return { type: 'ICON', value: 'ri:checkbox-circle-line' }

      default: {
        return { type: 'ICON', value: 'ri:filter-3-line' }
      }
    }
  }

  return { getFilterValueIcon }
}
