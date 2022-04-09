import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import { insertNodes, selectEditor, TElement, usePlateEditorRef } from '@udecode/plate'
import React, { useMemo } from 'react'
import { ELEMENT_ILINK } from '../../../editor/Components/ilink/defaults'
import { useLinks } from '../../../hooks/useLinks'
import useToggleElements from '../../../hooks/useToggleElements'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import useSuggestionStore from '../../../store/useSuggestions'
import IconButton from '../../../style/Buttons'
import { InfobarFull, InfobarTools } from '../../../style/infobar'

import { useSnippets } from '../../../hooks/useSnippets'
import { getContent } from '../../../utils/helpers'
import { NodeEditorContent } from '../../../types/Types'
import { SuggestionContent, SuggestionType } from './types'
import SmartSuggestions from './SmartSuggestions'
import { ELEMENT_INLINE_BLOCK } from '../../../editor/Components/InlineBlock/types'
import { defaultContent } from '../../../data/Defaults/baseData'

const SuggestionInfoBar = () => {
  // * Store
  const infobar = useLayoutStore((store) => store.infobar)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  // * Custom Hooks
  const editor = usePlateEditorRef()
  const { getSnippet } = useSnippets()
  const { getPathFromNodeid } = useLinks()
  const { toggleSuggestedNodes } = useToggleElements()
  const { suggestions, pinSuggestion, pinnedSuggestions } = useSuggestionStore()

  const onSuggestionClick = (event: MouseEvent, suggestion: SuggestionType, content?: NodeEditorContent): void => {
    event.stopPropagation()
    const selection = editor.selection
    if (suggestion.type === 'snippet' || suggestion.type === 'template') {
      insertNodes<TElement>(editor, content)
      selectEditor(editor, { at: selection, edge: 'start', focus: true })
    } else {
      // * Meta + click
      if (event.metaKey) {
        // * Insert Inline Embed
        insertNodes<TElement>(editor, {
          type: ELEMENT_INLINE_BLOCK,
          children: [{ text: '' }],
          value: suggestion.id
        })
      } else {
        // * Insert ILink
        insertNodes<TElement>(editor, {
          type: ELEMENT_ILINK,
          children: [{ text: '' }],
          value: suggestion.id
        })
      }
    }

    insertNodes(editor, defaultContent.content)
  }

  const getSuggestionContent = (suggestion: SuggestionType): SuggestionContent => {
    if (suggestion.type === 'snippet' || suggestion.type === 'template') {
      const snippet = getSnippet(suggestion.id)

      return {
        title: snippet.title,
        content: snippet.content,
        isTemplate: snippet.isTemplate
      }
    }

    return {
      title: getPathFromNodeid(suggestion.id),
      content: getContent(suggestion.id).content
    }
  }

  return (
    <InfobarFull>
      <InfobarTools>
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Smart Suggestions"
          highlight={infobar.mode === 'suggestions'}
          onClick={toggleSuggestedNodes}
        />
        <label htmlFor="smart-suggestions">Smart Suggestions</label>
      </InfobarTools>
      <SmartSuggestions
        suggestions={suggestions}
        pinned={pinnedSuggestions}
        onClick={onSuggestionClick}
        pinSuggestion={pinSuggestion}
        getContent={getSuggestionContent}
      />
    </InfobarFull>
  )
}

export default SuggestionInfoBar
