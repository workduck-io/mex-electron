import React, { useEffect } from 'react'

import { defaultContent } from '@data/Defaults/baseData'
import { getBlockMetadata } from '@editor/Actions/useEditorBlockSelection'
import { getLatestContent } from '@hooks/useEditorBuffer'
import { convertValueToTasks } from '@utils/lib/contentConvertTask'

import { tinykeys } from '@workduck-io/tinykeys'

import { getDefaultContent, PreviewProps } from '.'
import { useFocusBlock, useBlockHighlightStore } from '../../../editor/Actions/useFocusBlock'
import { Editor } from '../../../editor/Editor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import { FadeContainer } from '../../../style/animation/fade'
import { openNodeInMex } from '../../../utils/combineSources'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { useSaveChanges } from '../Search/useSearchProps'
import { spotlightShortcuts } from '../Shortcuts/list'
import PreviewHeader from './PreviewHeader'

export interface PreviewContainerProps extends PreviewProps {
  blockId?: string
  isNewTask?: boolean
  isNewNote?: boolean
  showPin?: boolean
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({
  nodeId,
  isNewNote,
  preview,
  showPin,
  blockId,
  isNewTask
}) => {
  // * Store

  const { saveIt } = useSaveChanges()
  const { shortcutDisabled } = useKeyListener()

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  // const getContent = useContentStore((state) => state.getContent)
  const contents = useContentStore((state) => state.contents)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const previewContent = useSpotlightEditorStore((state) => state.nodeContent)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const shortcuts = useHelpStore((state) => state.shortcuts)

  const { focusBlock } = useFocusBlock()
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const clearHighlights = useBlockHighlightStore((s) => s.clearHighlightedBlockIds)
  const highlights = useBlockHighlightStore((s) => s.hightlighted.editor)
  const deserializedContentNodes = getDeserializeSelectionToNodes(preview, normalMode)

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const selectionLength = deserializedContentNodes.length
      const lastBlock = deserializedContentNodes.at(-1)

      const deserializedContent = [
        ...deserializedContentNodes.slice(0, selectionLength - 1),
        { ...lastBlock, blockMeta: getBlockMetadata(preview.metadata?.url) }
      ]

      const activeNodeContent = getLatestContent(nodeId) ?? defaultContent.content

      if (!isNewTask) setNodeContent([...activeNodeContent, ...deserializedContent])
      else {
        const convertedTasks = convertValueToTasks(deserializedContent)
        setNodeContent([...activeNodeContent, ...convertedTasks])
      }
    }
  }, [preview, isNewTask, showSource, nodeId, normalMode])

  useEffect(() => {
    if (!preview.isSelection) {
      const activeNodeContent = getLatestContent(nodeId) ?? defaultContent.content
      if (activeNodeContent.length) setNodeContent(activeNodeContent)
    }
  }, [contents])

  const handleSaveContent = (saveAndClose: boolean, removeHighlight?: boolean) => {
    saveIt({ saveAndClose, removeHighlight, saveAfterBlur: false, saveToFile: true })

    if (isOnboarding) {
      openNodeInMex(nodeId)
      changeOnboarding(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        focusBlock(blockId, nodeId)
        setHighlights([blockId], 'editor')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, nodeId, previewContent])

  useEffect(() => {
    if (!normalMode && highlights.length > 0) {
      focusBlock(highlights[highlights.length - 1], nodeId)
      const clearHighlightTimeoutId = setTimeout(() => {
        clearHighlights('editor')
      }, 2000)
      return () => clearTimeout(clearHighlightTimeoutId)
    }
  }, [highlights, nodeId, normalMode, blockId])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled && !normalMode) handleSaveContent(true)
      },
      [spotlightShortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled && !normalMode) handleSaveContent(true)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [normalMode, handleSaveContent])

  const onPreviewClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    setNormalMode(false)
  }

  return (
    <FadeContainer fade={blockId !== undefined} onClick={onPreviewClick}>
      {!isNewNote && !isNewTask && showPin && <PreviewHeader noteId={nodeId} />}
      <Editor
        autoFocus={!normalMode}
        padding="1rem"
        showBalloonToolbar
        focusAtBeginning={!normalMode}
        options={{ exclude: { dnd: true } }}
        readOnly={normalMode}
        content={previewContent ?? getDefaultContent()}
        editorId={nodeId}
      />
    </FadeContainer>
  )
}

export default PreviewContainer
