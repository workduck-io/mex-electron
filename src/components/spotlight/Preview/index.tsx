import downIcon from '@iconify/icons-ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import React, { useMemo, useRef } from 'react'
import { useSpring } from 'react-spring'
import { defaultContent } from '../../../data/Defaults/baseData'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { mog } from '../../../utils/lib/helper'
import PreviewContainer from './PreviewContainer'
import { SeePreview, StyledPreview } from './styled'

export type PreviewType = {
  text: string
  metadata: string | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  nodeId: string
}

export const getDefaultContent = () => ({ ...defaultContent.content, id: generateTempId() })

const Preview: React.FC<PreviewProps> = ({ preview, nodeId }) => {
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  // * Custom hooks
  const ref = useRef<HTMLDivElement>()
  const { selection, searchResults, activeIndex } = useSpotlightContext()
  const isSnippet = searchResults[activeIndex]?.id?.startsWith('SNIPPET_')
  const snippets = useSnippetStore((store) => store.snippets)

  const { snippet, currentItem } = useMemo(() => {
    return {
      snippet: snippets.find((s) => s.id === searchResults[activeIndex]?.id),
      currentItem: searchResults[activeIndex]
    }
  }, [activeIndex, searchResults])

  const springProps = useMemo(() => {
    const style = { width: '45%', padding: '0' }

    if (!normalMode) {
      style.width = '100%'
    }

    if (searchResults[activeIndex] && searchResults[activeIndex]?.category !== CategoryType.backlink) {
      style.width = '0%'
    }

    if (searchResults[activeIndex] && searchResults[activeIndex]?.category === CategoryType.meeting) {
      if (normalMode) style.width = '45%'
      else style.width = '100%'
    }
    return style
  }, [normalMode, activeIndex, searchResults])

  const animationProps = useSpring(springProps)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  return (
    <StyledPreview
      key={`PreviewSpotlightEditor${!isSnippet ? nodeId : snippet.id}`}
      style={animationProps}
      ref={ref}
      preview={normalMode}
      data-tour="mex-quick-capture-preview"
    >
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      {isSnippet ? (
        <EditorPreviewRenderer
          content={snippet.content}
          blockId={currentItem && currentItem.extras && currentItem.extras.blockid}
          editorId={snippet.id}
        />
      ) : (
        <PreviewContainer
          nodeId={nodeId}
          blockId={currentItem && currentItem.extras && currentItem.extras.blockid}
          preview={preview}
        />
      )}
    </StyledPreview>
  )
}

export default Preview
