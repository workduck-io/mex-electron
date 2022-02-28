import React, { useEffect, useMemo, useRef } from 'react'
import { SeePreview, StyledPreview } from './styled'

import { Editor } from '../../../editor/Editor'
import { Icon } from '@iconify/react'
import { ItemActionType } from '../SearchResults/types'
import { NodeProperties } from '../../../store/useEditorStore'
import { defaultContent } from '../../../data/Defaults/baseData'
import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { getDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { openNodeInMex } from '../../../utils/combineSources'
import { spotlightShortcuts } from '../Shortcuts/list'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../../store/useContentStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import useOnboard from '../../../store/useOnboarding'
import { useSaveChanges } from '../Search/useSearchProps'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useSpring } from 'react-spring'

export type PreviewType = {
  text: string
  metadata: string | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  node: NodeProperties
}

export const getDefaultContent = () => ({ ...defaultContent.content, id: generateTempId() })

const Preview: React.FC<PreviewProps> = ({ preview, node }) => {
  // * Store
  const getContent = useContentStore((state) => state.getContent)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const previewContent = useSpotlightEditorStore((state) => state.nodeContent)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { shortcutDisabled } = useKeyListener()

  const { saveIt } = useSaveChanges()
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  // * Custom hooks
  const ref = useRef<HTMLDivElement>()
  const { selection, searchResults, activeIndex } = useSpotlightContext()
  const deserializedContentNodes = getDeserializeSelectionToNodes(preview, normalMode)

  const springProps = useMemo(() => {
    const style = { width: '45%', padding: '0' }

    if (!normalMode) {
      style.width = '100%'
    }

    if (searchResults[activeIndex]?.type !== ItemActionType.ilink) {
      style.width = '0%'
    }

    return style
  }, [normalMode, activeIndex, searchResults])

  const animationProps = useSpring(springProps)

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const deserializedContent = [{ children: deserializedContentNodes }]
      const activeNodeContent = getContent(node.nodeid)?.content ?? []

      setNodeContent([...activeNodeContent, ...deserializedContent])
    }
  }, [preview, showSource, node, normalMode])

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const handleSaveContent = (saveAndClose: boolean, removeHighlight?: boolean) => {
    saveIt({ saveAndClose, removeHighlight })

    if (isOnboarding) {
      openNodeInMex(node.nodeid)
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
        if (!shortcutDisabled && !normalMode) handleSaveContent(true, true)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [normalMode, handleSaveContent])

  return (
    <StyledPreview
      key={`PreviewSpotlightEditor${node.nodeid}`}
      style={animationProps}
      ref={ref}
      preview={normalMode}
      onClick={() => setNormalMode(false)}
      data-tour="mex-quick-capture-preview"
    >
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      <Editor
        autoFocus={!normalMode}
        focusAtBeginning={!normalMode}
        options={{ exclude: { dnd: true } }}
        readOnly={normalMode}
        content={previewContent ?? getDefaultContent()}
        editorId={node.nodeid}
      />
    </StyledPreview>
  )
}

export default Preview
