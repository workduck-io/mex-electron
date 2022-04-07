import pushpin2Line from '@iconify/icons-ri/pushpin-2-line'
import React from 'react'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import IconButton from '../../../style/Buttons'
import { ResultHeader, ResultTitle } from '../../../style/Search'
import { Margin, SuggestionContainer } from './styled'

type SuggestionProps = {
  suggestion: any
  onPin: (suggestion: any) => void
  onClick: (suggestion: any, content?: any) => void
}

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, onPin, onClick }) => {
  return (
    <Margin key={`mex-smart-suggestions-${suggestion.id}-pinned`} onClick={onClick}>
      <SuggestionContainer highlight={suggestion.pinned}>
        <ResultHeader>
          <ResultTitle>{suggestion?.content?.title}</ResultTitle>
          <IconButton highlight={suggestion.pinned} onClick={onPin} icon={pushpin2Line} title="Pin suggestion" />
        </ResultHeader>
        <EditorPreviewRenderer
          content={suggestion.content.content}
          editorId={`suggestion_preview_${suggestion.id}_pinned`}
        />
      </SuggestionContainer>
    </Margin>
  )
}

export default Suggestion
