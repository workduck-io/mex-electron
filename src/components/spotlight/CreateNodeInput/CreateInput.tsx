import { getPlateSelectors } from '@udecode/plate-core'
import React from 'react'
import useOnboard from '../../../store/useOnboarding'
import NodeSelect from '../../../components/mex/NodeSelect/NodeSelect'
import { StyledSpotlightInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'
import { AppType } from '../../../hooks/useInitialize'
import { useSaveData } from '../../../hooks/useSaveData'
import { useLinks } from '../../../hooks/useLinks'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHistoryStore } from '../../../store/useHistoryStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { openNodeInMex } from '../../../utils/combineSources'
import { appNotifierWindow } from '../../../electron/utils/notifiers'

export type CreateInputType = { value?: string }

const CreateInput: React.FC<CreateInputType> = () => {
  const { setSelection } = useSpotlightContext()
  const { setSaved } = useContentStore(({ saved, setSaved }) => ({ saved, setSaved }))
  const { title, uid: nodeId } = useEditorStore((state) => state.node)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  // const uid = useEditorStore((state) => state.node.uid)

  const addILink = useDataStore((s) => s.addILink)

  const saveData = useSaveData()

  const setFsContent = useContentStore((state) => state.setContent)

  const pushToHistory = useHistoryStore((state) => state.push)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const editorState = getPlateSelectors(nodeId).value()

  const { loadNodeAndAppend, loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreate = (newNodeId: string) => {
    const newUid = addILink(newNodeId)
    setSelection(undefined)

    setFsContent(newUid, editorState)

    pushToHistory(newNodeId)
    addRecent(newNodeId)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, newNodeId)

    saveData()
    setSaved(true)
    loadNode(newUid, { savePrev: true, fetch: false })
    openNodeInMex(newUid)
  }

  const handleChange = (nodeIdValue: string) => {
    const uid = getUidFromNodeId(nodeIdValue)
    if (nodeContent) {
      loadNodeAndAppend(uid, nodeContent)
    } else {
      loadNode(uid, { savePrev: true, fetch: false })
      pushToHistory(uid)
      addRecent(uid)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, uid)
    }
  }

  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect
        disabled={isOnboarding}
        id="wd-spotlight-editor-search"
        name="wd-spotlight-editor-search"
        prefillRecent
        placeholder={title}
        handleSelectItem={handleChange}
        handleCreateItem={handleOnCreate}
      />
    </StyledSpotlightInputWrapper>
  )
}

export default CreateInput
