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

/*
- Date
- Node level - Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention' | 'space'

export interface SearchFilter<Item> {
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

export type SearchFilterFunctions<Item> = Partial<{
  [key in FilterKey]: (item: Item, value: string) => boolean | number
}>

export interface FilterStore<Item> {
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  indexes?: idxKey[]
  setIndexes?: (indexes: idxKey[]) => void
  setFilters: (filters: SearchFilter<Item>[]) => void
  setCurrentFilters: (currentFilters: SearchFilter<Item>[]) => void
}

export const useFilterStoreBase = create<FilterStore<any>>((set) => ({
  filters: [],
  currentFilters: [],
  indexes: ['node', 'shared'],
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
  setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
}))

export const useFilterStore = <Item, Slice>(selector: (state: FilterStore<Item>) => Slice) =>
  useFilterStoreBase(selector)

export const useFilters = <Item>() => {
  const filters = useFilterStore((state) => state.filters) as SearchFilter<Item>[]
  const setFilters = useFilterStore((state) => state.setFilters) as (filters: SearchFilter<Item>[]) => void
  const currentFilters = useFilterStore((state) => state.currentFilters) as SearchFilter<Item>[]
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters) as (
    currentFilters: SearchFilter<Item>[]
  ) => void
  const { getTags } = useTags()

  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const { getNamespace } = useNamespaces()
  const filterFunctions = useGenericFilterFunctions()
  // setFilters: (filters: SearchFilter<any>[]) => void
  const addFilter = (filter: SearchFilter<Item>) => {
    setFilters([...filters, filter])
  }

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: SearchFilter<Item>) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: SearchFilter<Item>) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
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
    const currentFilters_ = currentFilters as unknown as SearchFilter<GenericSearchResult>[]
    const filteredItems = currentFilters_.length > 0 ? applyFilters(items, currentFilters_, filterFunctions) : items

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

    const tagsFilter: SearchFilter<GenericSearchResult>[] = Object.entries(rankedTags).reduce(
      (p: SearchFilter<GenericSearchResult>[], [tag, rank]) => {
        // const tags = tagsCache[tag]
        if (rank >= 1)
          return [
            ...p,
            {
              key: 'tag',
              icon: { type: 'ICON', value: 'ri:hashtag' },
              id: `tag_filter_${tag}`,
              label: tag,
              count: rank as number,
              value: tag
              // filter: (item: GenericSearchResult) => {
              //   return tags && tags.nodes.includes(item.id)
              // }
            }
          ]
        else return p
      },
      []
    )

    // mog('tagsFilter', { tagsCache, currentFilters_, rankedTags, tagsFilter })
    return tagsFilter
  }

  const generateNodeFilters = (items: GenericSearchResult[]) => {
    const currentFilters_ = currentFilters as unknown as SearchFilter<GenericSearchResult>[]
    const filteredItems = currentFilters_.length > 0 ? applyFilters(items, currentFilters_, filterFunctions) : items

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

    const nodeFilters = Object.entries(rankedPaths).reduce((acc, c) => {
      const [path, rank] = c
      if (rank > 1) {
        // mog('path', { path, rank })
        acc.push({
          key: 'note',
          id: `node_${path}`,
          icon: { type: 'ICON', value: 'ri:file-list-2-line' },
          value: path,
          label: path,
          count: rank as number
          // filter: (item: GenericSearchResult) => {
          //   const itemPath = getPathFromNodeid(item.id)
          //   mog('itemPath being filtered', { item, itemPath, path })
          //   return isElder(itemPath, path) || itemPath === path
          // }
        })
      }
      return acc
    }, [] as SearchFilter<GenericSearchResult>[])

    // mog('nodeFilters', { nodeFilters })
    return nodeFilters
  }

  const generateNamespaceFilters = <T extends { id: string }>(items: T[]) => {
    // Known
    const currentFilters_ = currentFilters as unknown as SearchFilter<GenericSearchResult>[]
    const filteredItems = currentFilters_.length > 0 ? applyFilters(items, currentFilters_, filterFunctions) : items

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

    const namespaceFilters = Object.entries(rankedNamespaces).reduce((acc, c) => {
      const [namespaceID, rank] = c
      const namespace = getNamespace(namespaceID)
      if (rank >= 1 && namespace) {
        // mog('path', { path, rank })
        acc.push({
          key: 'space',
          id: `namespace_${namespace}`,
          // Use Namespace icon
          icon: namespace.icon ?? { type: 'ICON', value: 'heroicons-outline:view-grid' },
          value: namespaceID,
          label: namespace.name,
          count: rank as number
          // filter: (item: GenericSearchResult) => {
          //   const itemPath = getPathFromNodeid(item.id)
          //   mog('itemPath being filtered', { item, itemPath, path })
          //   return isElder(itemPath, path) || itemPath === path
          // }
        })
      }
      return acc
    }, [] as SearchFilter<GenericSearchResult>[])

    // mog('nodeFilters', { nodeFilters })
    return namespaceFilters
  }

  const generateNodeSearchFilters = (items: GenericSearchResult[]) => {
    const nodeFilters = generateNodeFilters(items)
    const tagFilters = generateTagFilters(items)
    const namespaceFilters = generateNamespaceFilters(items)
    return [...nodeFilters, ...tagFilters, ...namespaceFilters]
  }

  return {
    addFilter,
    filters,
    resetFilters,
    applyCurrentFilters,
    setFilters,
    generateNodeFilters,
    generateTagFilters,
    addCurrentFilter,
    currentFilters,
    removeCurrentFilter,
    generateNodeSearchFilters,
    resetCurrentFilters
  }
}

export const applyFilters = <Item>(
  items: Item[],
  filters: SearchFilter<Item>[],
  filterFunctions: SearchFilterFunctions<Item>
): Item[] => {
  const filtered = filters.reduce((acc, filter) => {
    return acc.filter((i) => filterFunctions[filter.key](i, filter.value))
  }, items)

  mog('applyFilters', { items, filters, filtered })
  return filtered
}
