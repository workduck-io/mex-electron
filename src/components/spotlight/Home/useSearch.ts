import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ListItemType } from '../SearchResults/types'

import { getListItemFromNode, getListItemFromSnippet } from './helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { searchGoogle } from '../../../data/Actions'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { mog } from '../../../utils/lib/helper'

/* eslint-disable no-case-declarations */
import useLoad from '../../../hooks/useLoad'
import { useQuickLinks } from '../../../hooks/useQuickLinks'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { useSnippets } from '../../../hooks/useSnippets'
import { useSearch as useSearchHook } from '../../../hooks/useSearch'
import { useActionStore } from '../Actions/useActionStore'
import { getTodayTaskNodePath } from '@hooks/useTaskFromSelection'

export const CREATE_NEW_ITEM: ListItemType = {
  title: 'Create new ',
  id: 'create-new-node',
  icon: 'bi:plus-circle',
  type: QuickLinkType.backlink,
  category: CategoryType.backlink,
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

export const CREATE_NEW_TASK_ITEM: () => ListItemType = () => ({
  title: 'Create New Task',
  id: 'create-new-task',
  icon: 'bi:plus-circle',
  type: QuickLinkType.backlink,
  category: CategoryType.task,
  description: `In: ${getTodayTaskNodePath()}`,
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
    newTask: true
  }
})
export const useSearch = () => {
  const { isLocalNode } = useLoad()
  const { search } = useSpotlightContext()
  const { queryIndex } = useSearchHook()
  const { getQuickLinks } = useQuickLinks()
  const actions = useActionStore((store) => store.actions)
  const { getSnippet } = useSnippets()

  const searchInList = async () => {
    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    let sQuery: string

    if (search?.type === CategoryType.backlink) sQuery = search?.value.substring(2)
    else sQuery = search?.value

    switch (search?.type) {
      case CategoryType.performed:
        // const results = getSearchResults(search.value)
        mog('Searching action results', { search }, { pretty: true })
        break

      // * Search quick links using [[
      case CategoryType.backlink:
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
        const actionList = getSearchResults(val, actions, { keySelector: (obj) => obj.title })
        searchList = actionList
        break

      case CategoryType.search:
        const nodeItems = await queryIndex('node', search.value)
        const snippetItems = await queryIndex('snippet', search.value)

        const actionItems = getSearchResults(search.value, actions, { keySelector: (obj) => obj.title })
        const localNodes = []

        nodeItems.forEach((item) => {
          const localNode = isLocalNode(item.id)

          if (localNode.isLocal) {
            // mog('Local node', { localNode, item })
            const listItem = getListItemFromNode(localNode.ilink, item.text, item.blockId)
            localNodes.push(listItem)
          }
        })

        snippetItems.forEach((snippet) => {
          const snip = getSnippet(snippet.id)
          const item = getListItemFromSnippet(snip)
          localNodes.push(item)
        })

        const isNew = !isReservedOrClash(
          search.value,
          quickLinks.map((i) => i.title)
        )

        const mainItems = [...localNodes, ...actionItems]
        searchList = isNew ? [CREATE_NEW_ITEM, ...mainItems] : mainItems
        // mog('searchList', { searchList })
        if (mainItems.length === 0) searchList.push(searchGoogle(sQuery))

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
