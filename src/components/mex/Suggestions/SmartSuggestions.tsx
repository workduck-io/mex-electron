import React from 'react'
import { NodeEditorContent } from '../../../types/Types'
import Suggestion from './Suggestion'
import { SuggestionType } from './types'

type SmartSuggestionsProps = {
  suggestions: Array<SuggestionType>
  pinned: Array<SuggestionType>
  pinSuggestion: (suggestion: SuggestionType) => void
  onClick: (event: MouseEvent, suggestion: SuggestionType, content?: NodeEditorContent) => void
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

          const onPinSuggestion = () => {
            pinSuggestion(suggestion)
          }

          return (
            <Suggestion
              suggestion={suggestionWithContent}
              onPin={onPinSuggestion}
              onClick={onSuggestionClick}
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

          const onPinSuggestion = () => {
            pinSuggestion(suggestion)
          }

          return (
            <Suggestion
              suggestion={suggestionWithContent}
              onPin={onPinSuggestion}
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
