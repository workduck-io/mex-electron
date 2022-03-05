import { ItemActionType, ListItemType } from '../SearchResults/types'

import { CategoryType } from '../../../store/Context/context.spotlight'
import { ILink } from '../../../types/Types'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { Snippet } from '../../../store/useSnippetStore'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { getContent } from '../../../utils/helpers'

export const getListItemFromNode = (node: ILink) => {
  const content = getContent(node?.nodeid)
  const rawText = convertContentToRawText(content?.content ?? [], ' ')

  const listItem: ListItemType = {
    icon: node?.icon ?? 'gg:file-document',
    title: node?.path,
    id: node?.nodeid,
    description: rawText,
    type: QuickLinkType.ilink,
    category: CategoryType.quicklink,
    extras: {
      nodeid: node?.nodeid,
      path: node?.path,
      new: false
    },
    shortcut: {
      edit: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to Edit'
      },
      save: {
        category: 'action',
        keystrokes: '$mod+Enter',
        title: 'to save'
      }
    }
  }

  return listItem
}

export const getListItemFromSnippet = (snippet: Snippet) => {
  const rawText = convertContentToRawText(snippet?.content ?? [], ' ')
  const listItem: ListItemType = {
    icon: snippet.icon,
    title: snippet.title,
    id: snippet.id,
    description: rawText,
    type: QuickLinkType.snippet,
    category: CategoryType.quicklink,
    extras: {
      nodeid: snippet.id,
      path: snippet.title
    },
    shortcut: {
      copy: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to copy'
      },
      paste: {
        category: 'action',
        keystrokes: '$mod+Enter',
        title: 'to paste'
      }
    }
  }

  return listItem
}
