import { ItemActionType, ListItemType } from '../SearchResults/types'
import { ActionHelperConfig, ActionGroup } from '@workduck-io/action-request-helper'

import { CategoryType } from '../../../store/Context/context.spotlight'
import { ILink } from '../../../types/Types'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { Snippet } from '../../../store/useSnippetStore'
import { convertContentToRawText } from '../../../utils/search/parseData'
import { SearchRepExtra } from '../../../types/search'
import { getLatestContent } from '@hooks/useEditorBuffer'

type ListItemNodeOptions = {
  description: string
  blockId: string
  categoryType: CategoryType
  searchRepExtra: SearchRepExtra
}

export const getListItemFromNode = (node: ILink, options: Partial<ListItemNodeOptions> = {}) => {
  const rawText =
    options.description ??
    convertContentToRawText(getLatestContent(node?.nodeid) ?? [], ' ', { extra: options.searchRepExtra })

  const listItem: ListItemType = {
    icon: node?.icon ?? 'gg:file-document',
    title: node?.path,
    id: node?.nodeid,
    description: rawText,
    type: QuickLinkType.backlink,
    category: options.categoryType ?? CategoryType.backlink,
    extras: {
      nodeid: node?.nodeid,
      blockid: options.blockId,
      path: node?.path,
      namespace: node?.namespace,
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

export const getListItemFromAction = (config: ActionHelperConfig, actionGroup: ActionGroup) => {
  const actionItem: ListItemType = {
    icon: actionGroup?.icon ?? 'fluent:arrow-routing-24-filled',
    category: CategoryType.action,
    id: config.actionId,
    type: ItemActionType.action,
    description: config.description,
    shortcut: {
      search: {
        category: 'action',
        title: 'to Open',
        keystrokes: 'Enter'
      }
    },
    title: config.name,
    extras: {
      combo: true,
      actionGroup: {
        actionGroupId: actionGroup.actionGroupId,
        authTypeId: config.authTypeId
      }
    }
  }

  return actionItem
}

export const getListItemFromSnippet = (snippet: Snippet) => {
  const rawText = convertContentToRawText(snippet?.content ?? [], ' ')
  const listItem: ListItemType = {
    icon: snippet?.icon ?? 'ri:quill-pen-line',
    title: snippet?.title,
    id: snippet?.id,
    description: rawText,
    type: QuickLinkType.snippet,
    category: CategoryType.backlink,
    extras: {
      nodeid: snippet?.id,
      path: snippet?.title
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
