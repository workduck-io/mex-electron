import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import React, { useEffect, useMemo, useRef } from 'react'
import { SeePreview, StyledPreview } from './styled'

import { ActionTitle } from '../Actions/styled'
import { AppType } from '../../../hooks/useInitialize'
import { Editor } from '../../../editor/Editor'
import { Icon } from '@iconify/react'
import { IpcAction } from '../../../data/IpcAction'
import { ItemActionType } from '../SearchResults/types'
import { NodeProperties } from '../../../store/useEditorStore'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { defaultContent } from '../../../data/Defaults/baseData'
import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { getPlateSelectors } from '@udecode/plate'
import { openNodeInMex } from '../../../utils/combineSources'
import tinykeys from 'tinykeys'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { useHelpStore } from '../../../store/useHelpStore'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useSaver } from '../../../editor/Components/Saver'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
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
  const addILink = useDataStore((s) => s.addILink)
  const ilinks = useDataStore((s) => s.ilinks)
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { shortcutDisabled } = useKeyListener()

  const setSaved = useContentStore((state) => state.setSaved)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const addInRecentResearchNodes = useRecentsStore((state) => state.addInResearchNodes)

  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  // * Custom hooks
  const ref = useRef<HTMLDivElement>()
  const { onSave } = useSaver()
  const { selection, setSelection, setSearch, searchResults, activeIndex } = useSpotlightContext()
  const deserializedContentNodes = useDeserializeSelectionToNodes(node.nodeid, preview, normalMode)

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

  const handleSaveContent = () => {
    const isNodePresent = ilinks.find((ilink) => ilink.nodeid === node.nodeid)
    if (!isNodePresent) {
      addILink({ ilink: node.path, nodeid: node.nodeid })
    }

    onSave(node, true, false, getPlateSelectors(node.nodeid).value())

    appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    setSelection(undefined)
    setSearch({ value: '', type: CategoryType.search })
    setNormalMode(true)

    // * Add this item in recents list of Mex
    addRecent(node.nodeid)
    addInRecentResearchNodes(node.nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, { nodeid: node.nodeid })

    if (isOnboarding) {
      openNodeInMex(node.nodeid)
      changeOnboarding(false)
    }
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled && !normalMode) handleSaveContent()
      },
      '$cmd+Enter': (event) => {
        event.preventDefault()
        if (!shortcutDisabled && !normalMode) handleSaveContent()
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
      {/* <ActionTitle>{node.path}</ActionTitle> */}
      <Editor
        autoFocus={!normalMode}
        focusAtBeginning={!normalMode}
        options={{ exclude: { dnd: true } }}
        readOnly={normalMode}
        content={previewContent ?? getDefaultContent()}
        editorId={node.nodeid}
      />
      {/* {!normalMode && <SaverButton callbackAfterSave={onAfterSave} callbackBeforeSave={onBeforeSave} noButton />} */}
    </StyledPreview>
  )
}

export default Preview
