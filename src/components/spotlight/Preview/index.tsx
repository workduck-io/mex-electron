import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpring } from 'react-spring'
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import { defaultContent } from '../../../data/Defaults/baseData'
import { IpcAction } from '../../../data/IpcAction'
import { SaverButton } from '../../../editor/Components/Saver'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import Editor from '../../../editor/Editor'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import useEditorActions from '../../../hooks/useEditorActions'
import { AppType } from '../../../hooks/useInitialize'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { SearchType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { NodeProperties, useEditorStore } from '../../../store/useEditorStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { combineSources, openNodeInMex } from '../../../utils/combineSources'
import { useDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import { createNodeWithUid, mog } from '../../../utils/lib/helper'
import { SeePreview, StyledEditorPreview, StyledPreview } from './styled'

export type PreviewType = {
  text: string
  metadata: string | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  node: NodeProperties
}

const Preview: React.FC<PreviewProps> = ({ preview, node }) => {
  // * Store
  const fsContent = useEditorStore((state) => state.content)
  const previewContent = useEditorStore((state) => state.content)
  const setFsContent = useContentStore((state) => state.setContent)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const addILink = useDataStore((s) => s.addILink)
  const ilinks = useDataStore((s) => s.ilinks)

  const setSaved = useContentStore((state) => state.setSaved)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const saveEditorNode = useSpotlightEditorStore((s) => s.setNode)

  const { resetEditor } = useEditorActions()

  // * Custom hooks
  const { loadNodeProps } = useLoad()
  const ref = useRef<HTMLDivElement>()
  const { search, selection, setSelection, activeItem, setSearch } = useSpotlightContext()
  const deserializedContentNodes = useDeserializeSelectionToNodes(node.nodeid, preview)

  const springProps = useMemo(() => {
    const style = { width: '0%', opacity: 0, padding: '0' }
    if (activeItem?.item) return style

    if (selection || !normalMode) {
      if (!search.value) style.width = '100%'
      else {
        if (search.type === SearchType.action) style.width = '0%'
        else style.width = '50%'
      }
    } else {
      if (!search.value) style.width = '0%'
      else {
        if (search.type === SearchType.action) style.width = '0%'
        else style.width = '50%'
      }
    }

    if (style.width === '0%') {
      style.opacity = 0
      style.padding = '0'
    } else {
      style.opacity = 1
      style.padding = '0.5rem'
    }

    return style
  }, [selection, search.value, normalMode])

  const animationProps = useSpring(springProps)

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const deserializedContent = [{ children: deserializedContentNodes }]
      const changedContent = showSource ? combineSources(fsContent.content, deserializedContent) : fsContent

      setNodeContent(deserializedContent)
      setFsContent(node.nodeid, deserializedContent)

      // setNodeContent([...changedContent, { children: nodes }])
      // setFsContent(node.nodeid, [...changedContent, { children: nodes }])
    }
  }, [preview.text, showSource])

  useEffect(() => {
    if (!search.value) {
      loadNodeProps(node)
    }
  }, [preview.text])

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const onBeforeSave = () => {
    // Used in saver button. node is not polluted by user
    const isNodePresent = ilinks.find((ilink) => ilink.nodeid === node.nodeid)
    if (!isNodePresent) {
      addILink({ ilink: node.path, nodeid: node.nodeid })
    }
  }

  const onAfterSave = (nodeid: string) => {
    setSaved(true)

    setSelection(undefined)
    setSearch({ value: '', type: SearchType.search })
    setNormalMode(true)

    const nNode = createNodeWithUid(getNewDraftKey())
    saveEditorNode(nNode)
    loadNodeProps(nNode)

    // * Add this item in recents list of Mex
    addRecent(nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeid)

    // * Hide spotlight after save
    appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    if (isOnboarding) {
      openNodeInMex(nodeid)
      changeOnboarding(false)
    }
  }

  mog(node.nodeid, previewContent)

  return (
    <StyledPreview
      key={`PreviewSpotlightEditor${node.nodeid}`}
      style={animationProps}
      ref={ref}
      data-tour="mex-quick-capture-preview"
    >
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      <StyledEditorPreview>
        <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
          {
            <Editor
              autoFocus={!normalMode}
              focusAtBeginning={!normalMode}
              readOnly={search.value ? true : false}
              content={previewContent?.content ?? defaultContent.content}
              editorId={node.nodeid}
            />
          }
        </ErrorBoundary>
      </StyledEditorPreview>
      <SaverButton callbackAfterSave={onAfterSave} callbackBeforeSave={onBeforeSave} noButton />
    </StyledPreview>
  )
}

export default Preview
