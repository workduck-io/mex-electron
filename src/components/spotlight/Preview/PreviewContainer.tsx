import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import { getDefaultContent, PreviewProps } from '.'
import { Editor } from '../../../editor/Editor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import { openNodeInMex } from '../../../utils/combineSources'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { mog } from '../../../utils/lib/helper'
import { useSaveChanges } from '../Search/useSearchProps'
import { spotlightShortcuts } from '../Shortcuts/list'

const PreviewContainer: React.FC<PreviewProps> = ({ nodeId, preview }) => {
  // * Store

  const { saveIt } = useSaveChanges()
  const { shortcutDisabled } = useKeyListener()

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const getContent = useContentStore((state) => state.getContent)
  const contents = useContentStore((state) => state.contents)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const previewContent = useSpotlightEditorStore((state) => state.nodeContent)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const shortcuts = useHelpStore((state) => state.shortcuts)

  const deserializedContentNodes = getDeserializeSelectionToNodes(preview, normalMode)

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const deserializedContent = deserializedContentNodes
      const activeNodeContent = getContent(nodeId)?.content ?? []

      const nodeContent = [...activeNodeContent, ...deserializedContent]
      mog('PreviewContentSet', { nodeContent, activeNodeContent, deserializedContent })
      setNodeContent(nodeContent)
    }
  }, [preview, showSource, nodeId, normalMode])

  useEffect(() => {
    if (!preview.isSelection) {
      const activeNodeContent = getContent(nodeId)?.content ?? []
      mog('-------------  Setting node content  ------------------')
      mog('PreviewContentSet', { activeNodeContent })
      if (activeNodeContent.length) setNodeContent(activeNodeContent)
    }
  }, [contents])

  const handleSaveContent = (saveAndClose: boolean, removeHighlight?: boolean) => {
    saveIt({ saveAndClose, removeHighlight })

    if (isOnboarding) {
      openNodeInMex(nodeId)
      changeOnboarding(false)
    }
  }

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

  return (
    <div onClick={() => setNormalMode(false)}>
      <Editor
        autoFocus={!normalMode}
        focusAtBeginning={!normalMode}
        options={{ exclude: { dnd: true } }}
        readOnly={normalMode}
        content={previewContent ?? getDefaultContent()}
        editorId={nodeId}
      />
    </div>
  )
}

export default PreviewContainer
