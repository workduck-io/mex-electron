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
import PreviewContainer from './PreviewContainer'
import { SeePreview, StyledPreview } from './styled'
import 'react-contexify/dist/ReactContexify.css'

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

const Preview = () => {
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  // * Custom hooks
  const ref = useRef<HTMLDivElement>()
  const snippets = useSnippetStore((store) => store.snippets)
  const { selection, searchResults, activeIndex } = useSpotlightContext()
  const isSnippet = searchResults[activeIndex]?.id?.startsWith('SNIPPET_')

  const snippet = useMemo(() => {
    return snippets.find((s) => s.id === searchResults[activeIndex]?.id)
  }, [activeIndex, searchResults])

  const springProps = useMemo(() => {
    const style = { width: '45%', padding: '0' }

    if (!normalMode) {
      style.width = '100%'
    }

    if (searchResults[activeIndex]?.category !== CategoryType.quicklink) {
      style.width = '0%'
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const animationProps = useSpring(springProps)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  return (
    <StyledPreview style={animationProps} ref={ref} preview={normalMode} data-tour="mex-spotlight-preview">
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      {isSnippet ? <EditorPreviewRenderer content={snippet.content} editorId={snippet.id} /> : <PreviewContainer />}
    </StyledPreview>
  )
}

export default Preview
