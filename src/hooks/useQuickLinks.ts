import { getListItemFromNode, getListItemFromSnippet } from '../components/spotlight/Home/helper'

import { ListItemType } from '../components/spotlight/SearchResults/types'
import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'

export const useQuickLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)
  const sNodes = useDataStore((store) => store.sharedNodes)

  const getQuickLinks = (): Array<ListItemType> => {
    const mILinks = ilinks.map((ilink) => getListItemFromNode(ilink))
    const mSnippets = snippets.map((snippet) => getListItemFromSnippet(snippet))
    const sLinks = sNodes.map((node) => ({ ...getListItemFromNode(node), icon: 'ri:share-line' }))

    return [...mILinks, ...mSnippets, ...sLinks]
  }

  return {
    getQuickLinks
  }
}
