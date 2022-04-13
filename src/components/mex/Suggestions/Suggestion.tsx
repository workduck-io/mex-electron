import pushpin2Line from '@iconify/icons-ri/pushpin-2-line'
import { nanoid } from 'nanoid'
import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import IconButton from '../../../style/Buttons'
import { MexIcon } from '../../../style/Layouts'
import { ResultHeader, ResultTitle } from '../../../style/Search'
import { Margin, SuggestionContainer } from './styled'

type SuggestionProps = {
  suggestion: any
  onPin: (suggestion: any) => void
  onClick: (suggestion: any, content?: any) => void
}

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, onPin, onClick }) => {
  const editorId = useMemo(() => `suggestion_preview_${nanoid()}`, [])
  const theme = useTheme()

  return (
    <Margin key={`mex-smart-suggestions-${suggestion.id}-pinned`} onClick={onClick}>
      <SuggestionContainer highlight={suggestion.pinned}>
        <ResultHeader>
          <MexIcon
            fontSize={24}
            color={theme.colors.primary}
            icon={suggestion.type === 'node' ? 'ri:file-list-2-line' : 'ri:quill-pen-line'}
          />
          <ResultTitle>{suggestion?.content?.title}</ResultTitle>
          {!suggestion?.content?.isTemplate && (
            <IconButton highlight={suggestion.pinned} onClick={onPin} icon={pushpin2Line} title="Pin suggestion" />
          )}
        </ResultHeader>
        <EditorPreviewRenderer content={suggestion.content.content} editorId={editorId} />
      </SuggestionContainer>
    </Margin>
  )
}

export default Suggestion
