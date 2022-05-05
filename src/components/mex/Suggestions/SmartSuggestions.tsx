import React from 'react'
import { NodeEditorContent } from '../../../types/Types'
import { mog } from '../../../utils/lib/helper'
import Suggestion from './Suggestion'
import { SuggestionType } from './types'

type SmartSuggestionsProps = {
  suggestions: Array<SuggestionType>
  pinned: Array<SuggestionType>
  pinSuggestion: (suggestion: SuggestionType) => void
  onClick: (event: MouseEvent, suggestion: SuggestionType, content?: NodeEditorContent, embed?: boolean) => void
  getContent: (suggestion: SuggestionType) => any
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  pinned,
  onClick,
  getContent,
  pinSuggestion
}) => {
  return (
    <div>
      <>
        {pinned.map((suggestion) => {
          const content = getContent(suggestion)
          const suggestionWithContent = { ...suggestion, content }

          const onSuggestionClick = (event) => {
            onClick(event, suggestion, content.content)
          }

          const handleEmbedClick = (event) => {
            onClick(event, suggestion, content.content, true)
          }

          const onPinSuggestion = () => {
            pinSuggestion(suggestion)
          }

          return (
            <Suggestion
              suggestion={suggestionWithContent}
              onPin={onPinSuggestion}
              onClick={onSuggestionClick}
              onEmbedClick={handleEmbedClick}
              key={suggestion.id}
            />
          )
        })}
      </>
      <>
        {suggestions.map((suggestion) => {
          const content = getContent(suggestion)
          const suggestionWithContent = { ...suggestion, content }

          const onSuggestionClick = (event) => {
            onClick(event, suggestion, content.content)
          }

          const handleEmbedClick = (event) => {
            onClick(event, suggestion, content.content, true)
          }

          const onPinSuggestion = (ev) => {
            ev.stopPropagation()
            pinSuggestion(suggestion)
          }

          return (
            <Suggestion
              suggestion={suggestionWithContent}
              onPin={onPinSuggestion}
              onEmbedClick={handleEmbedClick}
              onClick={onSuggestionClick}
              key={suggestion.id}
            />
          )
        })}
      </>
    </div>
  )
}

export default SmartSuggestions
