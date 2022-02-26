import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../SearchResults/types'

import { ILink } from '../../../types/Types'
import { getListItemFromNode } from './helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { initActions } from '../../../data/Actions'
import { isNewILink } from '../../../components/mex/NodeSelect/NodeSelect'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { mog } from '../../../utils/lib/helper'
/* eslint-disable no-case-declarations */
import useDataStore from '../../../store/useDataStore'
import useLoad from '../../../hooks/useLoad'
import { useNewSearchStore } from '../../../store/useSearchStore'

export const CREATE_NEW_ITEM: ListItemType = {
  title: 'Create new ',
  id: 'create-new-node',
  icon: 'bi:plus-circle',
  type: ItemActionType.ilink,
  category: CategoryType.quicklink,
  description: 'Quick note',
  extras: {
    new: true
  }
}

export const useSearch = () => {
  const { isLocalNode } = useLoad()
  const { search } = useSpotlightContext()
  const ilinks = useDataStore((store) => store.ilinks)
  const searchIndex = useNewSearchStore((store) => store.searchIndex)

  const searchInList = () => {
    let searchList: Array<ListItemType> = []

    switch (search?.type) {
      // * Search quick links using [[
      case CategoryType.quicklink:
        const query = search.value.substring(2)
        if (query) {
          const localNodes = []

          ilinks.forEach((ilink) => {
            const localNode = isLocalNode(ilink.nodeid)

            if (localNode.isLocal) {
              localNodes.push(ilink)
            }
          })

          const results = getSearchResults(query, ilinks, { keySelector: (obj) => obj.path })

          const result: Array<ListItemType> = results.map((ilink: ILink) => {
            const item: ListItemType = getListItemFromNode(ilink)
            return item
          })

          const isNew = !isReservedOrClash(
            query,
            ilinks.map((i) => i.path)
          )

          searchList = isNew ? [CREATE_NEW_ITEM, ...result] : result
        }
        break

      // * Search actions using "/"
      case CategoryType.action:
        const val = search.value.substring(1)
        const actions = getSearchResults(val, initActions, { keySelector: (obj) => obj.title })
        searchList = actions
        break

      case CategoryType.search:
        const items = searchIndex(search.value)
        const actionItems = getSearchResults(search.value, initActions, { keySelector: (obj) => obj.title })
        const localNodes = []

        items.forEach((item) => {
          const localNode = isLocalNode(item.nodeUID)

          if (localNode.isLocal) {
            const listItem = getListItemFromNode(localNode.ilink)
            localNodes.push(listItem)
          }
        })

        const isNew = !isReservedOrClash(
          search.value,
          ilinks.map((i) => i.path)
        )

        searchList = isNew ? [CREATE_NEW_ITEM, ...localNodes, ...actionItems] : [...localNodes, ...actionItems]

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
