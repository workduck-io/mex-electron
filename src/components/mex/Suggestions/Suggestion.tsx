import pushpin2Line from '@iconify/icons-ri/pushpin-2-line'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { MexIcon } from '../../../style/Layouts'
import arrowGoBackLine from '@iconify/icons-ri/arrow-go-back-line'

import { ResultHeader, ResultTitle } from '../../../style/Search'
import { Margin, SuggestionContainer, SuggestionIconsGroup, SuggestionPreviewWrapper } from './styled'
import { getContent } from '@utils/helpers'
import { useBlockHighlightStore } from '@editor/Actions/useFocusBlock'
import { defaultContent } from '@data/Defaults/baseData'
import { IconButton } from '@workduck-io/mex-components'

type SuggestionProps = {
  suggestion: any
  onPin: (ev: any) => void
  onClick: (ev: any) => void
  onEmbedClick: (ev: any) => void
}

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, onPin, onClick, onEmbedClick }) => {
  const [showContent, setShowContent] = useState<boolean>(suggestion.pinned)
  const [nodeContent, setNodeContent] = useState<any>([])
  const setHighlights = useBlockHighlightStore((store) => store.setHighlightedBlockIds)

  const editorId = useMemo(() => `suggestion_preview_${nanoid()}`, [])

  const isNote = suggestion.type === 'node'
  const isShared = suggestion.type === 'shared'
  const icon = isNote ? 'ri:file-list-2-line' : isShared ? 'ri:share-line' : 'ri:quill-pen-line'

  const isSuggestedNote = isNote || isShared

  useEffect(() => {
    if (isSuggestedNote && (showContent || suggestion.pinned)) {
      const c = getContent(suggestion.id)?.content
      setNodeContent(c)
      setHighlights([suggestion.blockId], 'editor')
    } else {
      setNodeContent(suggestion?.content?.content)
    }
  }, [showContent])

  const handleClickContent = () => {
    if (isSuggestedNote) {
      setShowContent(true)
    }
  }

  return (
    <Margin key={`mex-smart-suggestions-${editorId}-pinned`}>
      <SuggestionContainer type={suggestion.type} highlight={suggestion.pinned}>
        <ResultHeader onClick={onClick}>
          <MexIcon noHover fontSize={24} icon={icon} />
          <ResultTitle>{suggestion?.content?.title}</ResultTitle>
          <SuggestionIconsGroup>
            {isSuggestedNote && <IconButton onClick={onClick} icon={arrowGoBackLine} title="Insert Backlink" />}
            <IconButton
              onClick={onEmbedClick}
              icon="lucide:file-input"
              title={isSuggestedNote ? 'Embed Note' : 'Insert Snippet'}
            />
            {!suggestion?.content?.template && (
              <IconButton highlight={suggestion.pinned} onClick={onPin} icon={pushpin2Line} title="Pin suggestion" />
            )}
          </SuggestionIconsGroup>
        </ResultHeader>

        <SuggestionPreviewWrapper onClick={handleClickContent}>
          <EditorPreviewRenderer
            noMouseEvents
            blockId={showContent && isSuggestedNote ? suggestion.blockId : undefined}
            content={nodeContent?.length ? nodeContent : defaultContent?.content}
            editorId={editorId}
          />
        </SuggestionPreviewWrapper>
      </SuggestionContainer>
    </Margin>
  )
}

export default Suggestion
