import React, { useLayoutEffect, useMemo, useRef } from 'react'

import { isParent } from '@components/mex/Sidebar/treeUtils'
import downIcon from '@iconify/icons-ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import { useSpotlightSettingsStore } from '@store/settings.spotlight'
import { mog } from '@utils/lib/helper'
import { useSpring } from 'react-spring'

import { BASE_TASKS_PATH, defaultContent } from '../../../data/Defaults/baseData'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSnippetStore } from '../../../store/useSnippetStore'
import PreviewContainer from './PreviewContainer'
import PreviewHeader from './PreviewHeader'
import { ScrollablePreview, SeePreview, StyledPreview } from './styled'

export type PreviewType = {
  text: string
  metadata: any | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  nodeId: string
}

export const getDefaultContent = () => ({ ...defaultContent.content[0], id: generateTempId() })

const Preview: React.FC<PreviewProps> = ({ preview, nodeId }) => {
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  // * Custom hooks
  const ref = useRef<HTMLDivElement>()
  const { selection, searchResults, activeIndex } = useSpotlightContext()
  const isSnippet = searchResults[activeIndex]?.id?.startsWith('SNIPPET_')
  const snippets = useSnippetStore((store) => store.snippets)
  const setShowSource = useSpotlightSettingsStore((state) => state.toggleSource)

  const { snippet, currentItem, blockid, isNewTask } = useMemo(() => {
    const currentItem = searchResults[activeIndex]
    const blockid = currentItem && currentItem.extras && currentItem.extras.blockid

    const curPath = currentItem?.extras?.path
    const isTaskNote = curPath ? isParent(curPath, BASE_TASKS_PATH) : false

    const isNewTask = (currentItem && currentItem.extras && currentItem.extras.newTask) || isTaskNote
    setShowSource(!isNewTask)

    return {
      snippet: snippets.find((s) => s.id === searchResults[activeIndex]?.id),
      currentItem,
      blockid,
      isNewTask
    }
  }, [activeIndex, searchResults])

  const springProps = useMemo(() => {
    const style = { width: '45%', padding: '0' }

    if (!normalMode) {
      style.width = '100%'
    }

    const itemCategory = searchResults?.[activeIndex]?.category

    if (
      itemCategory !== CategoryType.backlink &&
      itemCategory !== CategoryType.task &&
      itemCategory !== CategoryType.pinned
    ) {
      style.width = '0%'
    }

    if (itemCategory === CategoryType.meeting || itemCategory === CategoryType.task) {
      if (normalMode) style.width = '45%'
      else style.width = '100%'
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const animationProps = useSpring(springProps)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight + 2000
  }

  useLayoutEffect(() => {
    if (selection) {
      handleScrollToBottom()
    }
  }, [selection])

  const isAction = currentItem?.category === CategoryType.action

  return (
    <StyledPreview
      ref={ref}
      key={`PreviewSpotlightEditor${!isSnippet ? nodeId : snippet.id}`}
      style={animationProps}
      readOnly={normalMode}
      data-tour="mex-quick-capture-preview"
    >
      {selection && !isAction && (
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
          blockId={blockid}
          showPin={!isAction && normalMode}
          isNewNote={currentItem?.extras?.new}
          isNewTask={isNewTask}
          preview={preview}
        />
      )}
    </StyledPreview>
  )
}

export default Preview
