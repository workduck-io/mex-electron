import { useNodes } from '@hooks/useNodes'
import { useSearch } from '@hooks/useSearch'
import { useEditorStore } from '@store/useEditorStore'
import { useLayoutStore } from '@store/useLayoutStore'
import useSuggestionStore from '@store/useSuggestionStore'
import { NodeType } from '../../../types/Types'
import { getPlateEditorRef } from '@udecode/plate'
import { convertContentToRawText } from '@utils/search/parseData'
import { removeStopwords } from '@utils/stopwords'
import { useCallback } from 'react'

export const useSuggestions = () => {
  const { getNodeType } = useNodes()
  const { queryIndexWithRanking } = useSearch()
  const { setSuggestions } = useSuggestionStore()

  const getSuggestions = useCallback(async (value: any[]) => {
    const editorRef = getPlateEditorRef()
    const nodeId = useEditorStore.getState().node?.nodeid
    const mode = useLayoutStore.getState().infobar?.mode
    const isQABlock = useSuggestionStore.getState().headingQASearch
    const actionVisible = useSuggestionStore.getState().actionVisible

    if (mode === 'suggestions' && !isQABlock) {
      const cursorPosition = editorRef?.selection?.anchor?.path?.[0]
      const lastTwoParagraphs = cursorPosition > 2 ? cursorPosition - 2 : 0
      const rawText = convertContentToRawText(value.slice(lastTwoParagraphs, cursorPosition + 1), ' ')
      const keywords = removeStopwords(rawText)
      let searchFields

      const idKeys = ['node', 'snippet', 'shared']

      if (!actionVisible)
        searchFields = {
          node: ['text', 'title'],
          shared: ['text', 'title']
        }

      const results = await queryIndexWithRanking(idKeys as any, keywords.join(' '), { searchFields })

      const withoutCurrentNode = results.filter((item) => item.id !== nodeId)

      const suggestions = withoutCurrentNode.map((item) => {
        const nodeType = getNodeType(item.id)
        return {
          ...item,
          type: nodeType === NodeType.SHARED ? 'shared' : nodeType === NodeType.DEFAULT ? 'node' : 'snippet'
        }
      })

      setSuggestions(suggestions)
    }
  }, [])

  return {
    getSuggestions
  }
}
