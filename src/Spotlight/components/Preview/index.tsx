import React, { useEffect, useRef } from 'react'
import { NodeProperties, useEditorStore } from '../../../Editor/Store/EditorStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import Editor from '../../../Editor/Editor'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { combineSources, openNodeInMex } from '../../../Spotlight/utils/hooks'
import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import { SeePreview, StyledEditorPreview, StyledPreview } from './styled'
import { useDeserializeSelectionToNodes } from '../../../Spotlight/utils/helpers'
import useLoad from '../../../Hooks/useLoad/useLoad'
import { useSpring } from 'react-spring'
import { SaverButton } from '../../../Editor/Components/Saver'
import useOnboard from '../../../Components/Onboarding/store'
import useDataStore from '../../../Editor/Store/DataStore'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'
import { IpcAction } from '../../../Spotlight/utils/constants'
import { AppType } from '../../../Data/useInitialize'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'
import { createNodeWithUid } from '../../../Lib/helper'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'

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

  // * Custom hooks
  const { loadNodeProps } = useLoad()
  const ref = useRef<HTMLDivElement>()
  const { search, selection, setSelection, setSearch } = useSpotlightContext()
  const nodes = useDeserializeSelectionToNodes(node.uid, preview)

  const animationProps = useSpring({ width: search && normalMode ? '60%' : '100%' })

  useEffect(() => {
    const newNodeContent = [{ children: nodes }]
    if (preview.isSelection && nodes) {
      const changedContent = showSource ? combineSources(fsContent, newNodeContent) : fsContent

      setNodeContent([{ children: nodes }])
      setFsContent(node.uid, [{ children: nodes }])

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

  return (
    <StyledPreview style={animationProps} ref={ref} data-tour="mex-quick-capture-preview">
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      <StyledEditorPreview>
        {previewContent && (
          <Editor
            autoFocus={selection || !normalMode}
            focusAtBeginning={false}
            readOnly={!search || selection ? false : true}
            content={previewContent}
            editorId={node.uid}
          />
        )}
      </StyledEditorPreview>
      <SaverButton callbackAfterSave={onAfterSave} callbackBeforeSave={onBeforeSave} noButton />
    </StyledPreview>
  )
}

export default Preview
