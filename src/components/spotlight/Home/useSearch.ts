import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ListItemType } from '../SearchResults/types'

import { getListItemFromNode } from './helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { initActions } from '../../../data/Actions'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { mog } from '../../../utils/lib/helper'
/* eslint-disable no-case-declarations */
import useLoad from '../../../hooks/useLoad'
import { useSearchStore } from '../../../store/useSearchStore'
import { useQuickLinks } from '../../../hooks/useQuickLinks'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'

export const CREATE_NEW_ITEM: ListItemType = {
  title: 'Create new ',
  id: 'create-new-node',
  icon: 'bi:plus-circle',
  type: QuickLinkType.ilink,
  category: CategoryType.quicklink,
  description: 'Quick note',
  shortcut: {
    edit: {
      category: 'action',
      keystrokes: 'Enter',
      title: 'to create'
    },
    save: {
      category: 'action',
      keystrokes: '$mod+Enter',
      title: 'to save'
    }
  },
  extras: {
    new: true
  }
}

export const useSearch = () => {
  const { isLocalNode } = useLoad()
  const { search } = useSpotlightContext()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const { getQuickLinks } = useQuickLinks()

  const searchInList = () => {
    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    switch (search?.type) {
      // * Search quick links using [[
      case CategoryType.quicklink:
        const query = search.value.substring(2)
        if (query) {
          const results = getSearchResults(query, quickLinks, { keySelector: (obj) => obj.title })
          mog('Searching', { results, quickLinks })

          const isNew = !isReservedOrClash(
            query,
            quickLinks.map((i) => i.title)
          )

          searchList = isNew ? [CREATE_NEW_ITEM, ...results] : results
        }
        break

      // * Search actions using "/"
      case CategoryType.action:
        const val = search.value.substring(1)
        const actions = getSearchResults(val, initActions, { keySelector: (obj) => obj.title })
        searchList = actions
        break

      case CategoryType.search:
        const items = searchIndex('node', search.value)
        const actionItems = getSearchResults(search.value, initActions, { keySelector: (obj) => obj.title })
        const localNodes = []

        items.forEach((item) => {
          const localNode = isLocalNode(item.id)

          if (localNode.isLocal) {
            const listItem = getListItemFromNode(localNode.ilink)
            localNodes.push(listItem)
          }
        })

        const isNew = !isReservedOrClash(
          search.value,
          quickLinks.map((i) => i.title)
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
