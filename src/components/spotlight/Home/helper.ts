import { getContent } from '../../../utils/helpers'
import { ILink } from '../../../types/Types'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { ItemActionType, ListItemType } from '../SearchResults/types'
import { CategoryType } from '../../../store/Context/context.spotlight'

export const getListItemFromNode = (node: ILink) => {
  const content = getContent(node?.nodeid)
  const rawText = convertContentToRawText(content?.content ?? [], ' ')

  const listItem: ListItemType = {
    icon: node?.icon ?? 'gg:file-document',
    title: node?.path,
    id: node?.nodeid,
    description: rawText,
    type: ItemActionType.ilink,
    category: CategoryType.quicklink,
    extras: {
      nodeid: node?.nodeid,
      path: node?.path,
      new: false
    },
    shortcut: ['Enter']
  }

  return listItem
}
