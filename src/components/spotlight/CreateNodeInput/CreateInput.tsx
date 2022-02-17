import { getPlateSelectors } from '@udecode/plate-core'
import React from 'react'
import NodeSelect from '../../../components/mex/NodeSelect/NodeSelect'
import { StyledSpotlightInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useSaveData } from '../../../hooks/useSaveData'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHistoryStore } from '../../../store/useHistoryStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { openNodeInMex } from '../../../utils/combineSources'

export type CreateInputType = { value?: string }

const CreateInput: React.FC<CreateInputType> = () => {
  const { setSelection } = useSpotlightContext()
  const { setSaved } = useContentStore(({ saved, setSaved }) => ({ saved, setSaved }))
  const { title, nodeid: path } = useEditorStore((state) => state.node)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const addILink = useDataStore((s) => s.addILink)

  const { saveData } = useSaveData()

  const setFsContent = useContentStore((state) => state.setContent)

  const pushToHistory = useHistoryStore((state) => state.push)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const editorState = getPlateSelectors(path).value()

  const { loadNodeAndAppend, loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreate = (newNodeId: string) => {
    const newUid = addILink({ ilink: newNodeId }).nodeid
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

  const handleChange = (pathValue: string) => {
    const nodeid = getUidFromNodeId(pathValue)
    if (nodeContent) {
      loadNodeAndAppend(nodeid, nodeContent)
    } else {
      loadNode(nodeid, { savePrev: true, fetch: false })
      pushToHistory(nodeid)
      addRecent(nodeid)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeid)
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
