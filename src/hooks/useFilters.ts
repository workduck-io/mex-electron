import { MIcon } from '../types/Types'
import create from 'zustand'

import { getAllParentIds, isElder } from '../components/mex/Sidebar/treeUtils'
// import create from 'zustand'
import { GenericSearchResult, idxKey } from '../types/search'
import { mog } from '../utils/lib/helper'
import { useGenericFilterFunctions } from './useFilterFunctions'
import { useLinks } from './useLinks'
import { useNamespaces } from './useNamespaces'
import { useTags } from './useTags'
import { Filter, Filters, FilterType, FilterTypeWithOptions, SearchFilterFunctions } from '../types/filters'

/*
- Date
- Node level - Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention' | 'space'

export interface SearchFilter {
  key: FilterKey
  id: string
  label: string
  // Value to filter with
  value: string
  // filter: (item: Item) => boolean | number -> Replaced by FilterFunctions
  icon?: MIcon
  // No. of items that match this filter
  count?: number
  // sort: 'asc' | 'desc'
}

export interface FilterStore {
  filters: Filters
  currentFilters: Filter[]
  indexes?: idxKey[]
  setIndexes?: (indexes: idxKey[]) => void
  setFilters: (filters: Filters) => void
  setCurrentFilters: (currentFilters: Filter[]) => void
}

export const useFilterStoreBase = create<FilterStore>((set) => ({
  filters: [],
  currentFilters: [],
  indexes: ['node', 'shared'],
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
  setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
}))

export const useFilterStore = <Slice>(selector: (state: FilterStore) => Slice) => useFilterStoreBase(selector)

export const useFilters = <Item>() => {
  const filters = useFilterStore((state) => state.filters)
  const setFilters = useFilterStore((state) => state.setFilters)
  const currentFilters = useFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters)

  const { getTags } = useTags()

  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const { getNamespace } = useNamespaces()
  const filterFunctions = useGenericFilterFunctions()
  // setFilters: (filters: SearchFilter<any>[]) => void

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: Filter) => {
    mog('addCurrentFilter', { filter })
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const changeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.map((f) => (f.id === filter.id ? filter : f)))
  }

  const applyCurrentFilters = (items: Item[]) => {
    return applyFilters(items, currentFilters, filterFunctions)
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  const generateTagFilters = (items: GenericSearchResult[]) => {
    // const tagsCache = useDataStore.getState().tagsCache
    // OK
    const filteredItems = currentFilters.length > 0 ? applyFilters(items, currentFilters, filterFunctions) : items

    const rankedTags = filteredItems.reduce((acc, item) => {
      const tags = getTags(item.id)
      if (tags) {
        tags.forEach((tag) => {
          if (!acc[tag]) {
            acc[tag] = 1
          } else {
            acc[tag] += 1
          }
        })
      }
      return acc
    }, {} as { [tag: string]: number })

    const tagsFilter: FilterTypeWithOptions = Object.entries(rankedTags).reduce(
      (p: FilterTypeWithOptions, [tag, rank]) => {
        // const tags = tagsCache[tag]
        if (rank >= 0)
          return {
            ...p,
            options: [
              ...p.options,
              {
                id: `tag_filter_${tag}`,
                label: tag,
                count: rank as number,
                value: tag
              }
            ]
          }
        else return p
      },
      {
        type: 'tag',
        label: 'Tags',
        options: []
      }
    )

    mog('tagsFilter', { rankedTags, tagsFilter })
    return tagsFilter
  }

  const generateNodeFilters = (items: GenericSearchResult[]) => {
    const filteredItems = currentFilters.length > 0 ? applyFilters(items, currentFilters, filterFunctions) : items

    const rankedPaths = filteredItems.reduce((acc, item) => {
      const path = getPathFromNodeid(item.id, true)
      const allPaths = getAllParentIds(path)
      // const allPaths =
      allPaths.forEach((path) => {
        if (acc[path]) {
          acc[path] += 1
        } else {
          acc[path] = 1
        }
      })
      return acc
    }, {} as { [path: string]: number })

    const nodeFilters: FilterTypeWithOptions = Object.entries(rankedPaths).reduce(
      (acc: FilterTypeWithOptions, c) => {
        const [path, rank] = c
        if (rank >= 0) {
          // mog('path', { path, rank })
          acc.options.push({
            id: `node_${path}`,
            value: path,
            label: path,
            count: rank as number
          })
        }
        return acc
      },
      {
        type: 'note',
        label: 'Notes',
        options: []
      } as FilterTypeWithOptions
    )

    // mog('nodeFilters', { nodeFilters })
    return nodeFilters
  }

  const generateNamespaceFilters = <T extends { id: string }>(items: T[]) => {
    // Known
    const filteredItems = currentFilters.length > 0 ? applyFilters(items, currentFilters, filterFunctions) : items

    const rankedNamespaces = filteredItems.reduce((acc, item) => {
      const node = getILinkFromNodeid(item.id, true)
      const namespace = node?.namespace

      if (namespace) {
        if (!acc[namespace]) {
          acc[namespace] = 1
        } else {
          acc[namespace] += 1
        }
      }

      return acc
    }, {} as { [namespace: string]: number })

    const namespaceFilters = Object.entries(rankedNamespaces).reduce(
      (acc, c) => {
        const [namespaceID, rank] = c
        const namespace = getNamespace(namespaceID)
        if (rank >= 0 && namespace) {
          // mog('path', { path, rank })
          acc.options.push({
            id: `namespace_${namespace.id}`,
            // Use Namespace icon
            value: namespaceID,
            label: namespace.name,
            count: rank as number
          })
        }
        return acc
      },
      {
        type: 'space',
        label: 'Spaces',
        options: []
      } as FilterTypeWithOptions
    )

    // mog('nodeFilters', { nodeFilters })
    return namespaceFilters
  }

  const generateNodeSearchFilters = (items: GenericSearchResult[]) => {
    const nodeFilters = generateNodeFilters(items)
    const tagFilters = generateTagFilters(items)
    const namespaceFilters = generateNamespaceFilters(items)
    return [nodeFilters, tagFilters, namespaceFilters]
  }

  return {
    filters,
    resetFilters,
    applyCurrentFilters,
    setFilters,
    generateNodeFilters,
    generateTagFilters,
    addCurrentFilter,
    changeCurrentFilter,
    currentFilters,
    removeCurrentFilter,
    generateNodeSearchFilters,
    resetCurrentFilters
  }
}

export const applyFilters = <Item>(
  items: Item[],
  filters: Filter[],
  filterFunctions: SearchFilterFunctions
): Item[] => {
  // TODO: Insert the global any and all filters match condition here
  const filtered = filters.reduce((acc, filter) => {
    return acc.filter((i) => filterFunctions[filter.type](i, filter))
  }, items)

  mog('applyFilters', { items, filters, filtered })
  return filtered
}
