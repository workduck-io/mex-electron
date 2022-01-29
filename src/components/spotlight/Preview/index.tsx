import React, { useEffect, useRef } from 'react'
import { NodeProperties, useEditorStore } from '../../../store/useEditorStore'
import { useContentStore } from '../../../store/useContentStore'
import Editor from '../../../editor/Editor'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { combineSources, openNodeInMex } from '../../../utils/combineSources'
import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { SeePreview, StyledEditorPreview, StyledPreview } from './styled'
import { useDeserializeSelectionToNodes } from '../../../utils/htmlDeserializer'
import useLoad from '../../../hooks/useLoad'
import { useSpring } from 'react-spring'
import { SaverButton } from '../../../editor/Components/Saver'
import useOnboard from '../../../store/useOnboarding'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { createNodeWithUid, mog } from '../../../utils/lib/helper'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { defaultContent } from '../../../data/Defaults/baseData'
import { ErrorBoundary } from 'react-error-boundary'
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import useEditorActions from '../../../hooks/useEditorActions'

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
  const setSaved = useContentStore((state) => state.setSaved)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const saveEditorNode = useSpotlightEditorStore((s) => s.setNode)

  const { resetEditor } = useEditorActions()

  // * Custom hooks
  const { loadNodeProps } = useLoad()
  const ref = useRef<HTMLDivElement>()
  const { search, selection, setSelection, setSearch } = useSpotlightContext()
  const deserializedContentNodes = useDeserializeSelectionToNodes(node.uid, preview)

  const animationProps = useSpring({ width: search ? '60%' : '100%' })

  useEffect(() => {
    if (preview.isSelection && deserializedContentNodes) {
      const deserializedContent = [{ children: deserializedContentNodes }]
      const changedContent = showSource ? combineSources(fsContent.content, deserializedContent) : fsContent

      setNodeContent(deserializedContent)
      setFsContent(node.uid, deserializedContent)

      // * FIX: For BUBBLE MODE
      // setNodeContent([...changedContent, { children: nodes }])
      // setFsContent(node.uid, [...changedContent, { children: nodes }])
    }
  }, [preview.text, showSource])

  useEffect(() => {
    if (!search) {
      loadNodeProps(node)
    }
  }, [preview.text])

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const onBeforeSave = () => {
    mog(node.id, { node })
    addILink(node.key, node.uid)
  }

  const onAfterSave = (uid: string) => {
    setSaved(true)

    setSelection(undefined)
    setSearch('')
    setNormalMode(true)

    const nNode = createNodeWithUid(getNewDraftKey())
    saveEditorNode(nNode)
    loadNodeProps(nNode)

    // * Add this item in recents list of Mex
    addRecent(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, uid)

    // * Hide spotlight after save
    appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    if (isOnboarding) {
      openNodeInMex(uid)
      changeOnboarding(false)
    }
  }

  mog(node.uid, previewContent)

  return (
    <StyledPreview
      key={`PreviewSpotlightEditor${node.uid}`}
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
              readOnly={search ? true : false}
              content={previewContent?.content ?? defaultContent.content}
              editorId={node.uid}
            />
          }
        </ErrorBoundary>
      </StyledEditorPreview>
      <SaverButton callbackAfterSave={onAfterSave} callbackBeforeSave={onBeforeSave} noButton />
    </StyledPreview>
  )
}

export default Preview
