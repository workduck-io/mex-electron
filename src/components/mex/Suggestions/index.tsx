import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import { ELEMENT_PARAGRAPH, insertNodes, selectEditor, TElement, usePlateEditorRef } from '@udecode/plate'
import React from 'react'
import { ELEMENT_ILINK } from '../../../editor/Components/ilink/defaults'
import { useLinks } from '../../../hooks/useLinks'
import useToggleElements from '../../../hooks/useToggleElements'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import useSuggestionStore from '../../../store/useSuggestionStore'
import IconButton from '../../../style/Buttons'
import { InfobarMedium, InfobarTools } from '../../../style/infobar'
import appsLine from '@iconify/icons-ri/apps-line'

import { useSnippets } from '../../../hooks/useSnippets'
import { getContent } from '../../../utils/helpers'
import { NodeEditorContent } from '../../../types/Types'
import { SuggestionContent, SuggestionType } from './types'
import SmartSuggestions from './SmartSuggestions'
import { ELEMENT_INLINE_BLOCK } from '../../../editor/Components/InlineBlock/types'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { mog } from '@utils/lib/helper'

const SuggestionInfoBar = () => {
  // * Store
  const infobar = useLayoutStore((store) => store.infobar)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const actionsVisible = useSuggestionStore((store) => store.actionVisible)
  const toggleActionInSuggestions = useSuggestionStore((store) => store.toggleActionInSuggestion)
  const isQABlock = useSuggestionStore((store) => store.headingQASearch)

  // * Custom Hooks
  const editor = usePlateEditorRef()
  const { getSnippet } = useSnippets()
  const { getPathFromNodeid } = useLinks()
  const { toggleSuggestedNodes } = useToggleElements()
  const { suggestions, pinSuggestion, pinnedSuggestions } = useSuggestionStore()

  const onSuggestionClick = (
    event: MouseEvent,
    suggestion: SuggestionType,
    content?: NodeEditorContent,
    embed?: boolean
  ): void => {
    event.stopPropagation()
    const selection = editor.selection
    if (suggestion.type === 'snippet' || suggestion.type === 'template') {
      insertNodes<TElement>(editor, content)
      selectEditor(editor, { at: selection, edge: 'start', focus: true })
    } else {
      // * Meta + click
      if (event.metaKey || embed) {
        // * Insert Inline Embed
        insertNodes<TElement>(editor, {
          type: ELEMENT_INLINE_BLOCK,
          children: [{ text: '' }],
          value: suggestion.id
        })
      } else {
        // * Insert ILink
        // As link is inline, we add a p wrapper on it
        const link = {
          type: ELEMENT_ILINK,
          children: [{ text: ' ', id: generateTempId() }],
          value: suggestion.id,
          id: generateTempId()
        }
        insertNodes<TElement>(editor, link)
      }
    }

    // insertNodes(editor, defaultContent.content)
  }

  const getSuggestionContent = (suggestion: SuggestionType): SuggestionContent => {
    if (suggestion.type === 'snippet' || suggestion.type === 'template') {
      const snippet = getSnippet(suggestion.id)

      return {
        title: snippet.title,
        content: snippet.content,
        template: snippet.template
      }
    }

    return {
      title: getPathFromNodeid(suggestion.id, true),
      content: [suggestion.data] ?? getContent(suggestion.id).content
    }
  }

  // mog('SuggestionInfoBar', { suggestions, pinnedSuggestions })

  return (
    <InfobarMedium>
      <InfobarTools>
        {/*
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Smart Suggestions"
          highlight={infobar.mode === 'suggestions'}
          onClick={toggleSuggestedNodes}
        /> */}
        <label htmlFor="smart-suggestions">Smart Suggestions</label>
        {!isQABlock && (
          <IconButton
            size={24}
            icon={appsLine}
            highlight={actionsVisible}
            title={actionsVisible ? 'Hide Actions' : 'Show Actions'}
            onClick={toggleActionInSuggestions}
          />
        )}
      </InfobarTools>
      <SmartSuggestions
        suggestions={suggestions}
        pinned={pinnedSuggestions}
        onClick={onSuggestionClick}
        pinSuggestion={pinSuggestion}
        getContent={getSuggestionContent}
      />
    </InfobarMedium>
  )
}

export default SuggestionInfoBar
