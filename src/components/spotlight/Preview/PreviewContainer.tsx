import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import { getDefaultContent } from '.'
import { Editor } from '../../../editor/Editor'
import useOnboard from '../../../store/useOnboarding'
import { useHelpStore } from '../../../store/useHelpStore'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import { openNodeInMex } from '../../../utils/combineSources'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { useSaveChanges } from '../Search/useSearchProps'
import { spotlightShortcuts } from '../Shortcuts/list'

const PreviewContainer = () => {
  // * Store
  const { saveIt } = useSaveChanges()
  const { shortcutDisabled } = useKeyListener()

  const preview = useSpotlightEditorStore((store) => store.preview)
  const nodeId = useSpotlightEditorStore((store) => store.node.nodeid)

  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const getContent = useContentStore((state) => state.getContent)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const previewContent = useSpotlightEditorStore((state) => state.nodeContent)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  const deserializedContentNodes = getDeserializeSelectionToNodes(preview, normalMode)

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const deserializedContent = [{ children: deserializedContentNodes }]
      const activeNodeContent = getContent(nodeId)?.content ?? []

      setNodeContent([...activeNodeContent, ...deserializedContent])
    }
  }, [preview, showSource, nodeId, normalMode])

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
