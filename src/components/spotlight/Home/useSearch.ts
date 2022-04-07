import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ListItemType } from '../SearchResults/types'

import { getListItemFromNode, getListItemFromSnippet } from './helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { initActions } from '../../../data/Actions'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { mog } from '../../../utils/lib/helper'
/* eslint-disable no-case-declarations */
import useLoad from '../../../hooks/useLoad'
import { useQuickLinks } from '../../../hooks/useQuickLinks'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { useSnippets } from '../../../hooks/useSnippets'
import { useSearch as useSearchHook } from '../../../hooks/useSearch'

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
  const { queryIndex } = useSearchHook()
  const { getQuickLinks } = useQuickLinks()
  const { getSnippet } = useSnippets()

  const searchInList = async () => {
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
        const nodeItems = await queryIndex('node', search.value)
        const snippetItems = await queryIndex('snippet', search.value, ['snippet'])

        const actionItems = getSearchResults(search.value, initActions, { keySelector: (obj) => obj.title })
        const localNodes = []

        nodeItems.forEach((item) => {
          const localNode = isLocalNode(item.id)

          if (localNode.isLocal) {
            const listItem = getListItemFromNode(localNode.ilink)
            localNodes.push(listItem)
          }
        })

        snippetItems.forEach((snippet) => {
          const snip = getSnippet(snippet.id)
          const item = getListItemFromSnippet(snip)
          mog('item', { item })
          localNodes.push(item)
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
