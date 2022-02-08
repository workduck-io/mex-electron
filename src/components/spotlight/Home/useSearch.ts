/* eslint-disable no-case-declarations */
import useDataStore from '../../../store/useDataStore'
import { search as getSearchResults } from 'fast-fuzzy'

import { SearchType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { isNewILink } from '../../../components/mex/NodeSelect/NodeSelect'
import { getListItemFromNode } from './helper'
import { ILink } from '../../../types/Types'
import { ListItemType, ItemActionType } from '../SearchResults/types'
import { initActions } from '../../../data/Actions'
import { useNewSearchStore } from '../../../store/useSearchStore'
import { mog } from '../../../utils/lib/helper'

export const useSearch = () => {
  const { search } = useSpotlightContext()
  const ilinks = useDataStore((store) => store.ilinks)
  const searchIndex = useNewSearchStore((store) => store.searchIndex)

  const searchInList = () => {
    let searchList: Array<ListItemType> = []

    switch (search.type) {
      // * Search quick links using [[
      case SearchType.quicklink:
        const query = search.value.substring(2)
        if (query) {
          const results = getSearchResults(query, ilinks, { keySelector: (obj) => obj.path })

          const result: Array<ListItemType> = results.map((ilink: ILink) => {
            const item: ListItemType = getListItemFromNode(ilink)
            return item
          })

          const isNew = isNewILink(query, ilinks)

          searchList = isNew
            ? [
                {
                  title: 'Create new ',
                  id: 'create-new-node',
                  icon: 'bi:plus-circle',
                  type: ItemActionType.ilink,
                  extras: {
                    new: true
                  }
                },
                ...result
              ]
            : result
        }
        break

      // * Search actions using "/"
      case SearchType.action:
        const val = search.value.substring(1)
        const actions = getSearchResults(val, initActions, { keySelector: (obj) => obj.title })
        searchList = actions
        break

      case SearchType.search:
        const items = searchIndex(search.value)
        mog('normal search', { items, search: search.value })
        const res = items.map((item) => {
          const ilink = ilinks.find((link) => link.nodeid === item.nodeUID)
          const listItem = getListItemFromNode(ilink)

          return listItem
        })

        searchList = res
        break

      default:
        break
    }

    return searchList
  }

  return {
    searchInList
  }
}