import { useStoreEditorValue } from '@udecode/plate-core'
import React from 'react'
import { useLinks } from '../../../Editor/Actions/useLinks'
import NodeSelect from '../../../Components/NodeSelect/NodeSelect'
import { StyledSpotlightInputWrapper } from '../../../Components/NodeSelect/NodeSelect.styles'
import { AppType } from '../../../Data/useInitialize'
import { useSaveData } from '../../../Data/useSaveData'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useHistoryStore } from '../../../Editor/Store/HistoryStore'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import useLoad from '../../../Hooks/useLoad/useLoad'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { IpcAction } from '../../../Spotlight/utils/constants'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { openNodeInMex } from '../../../Spotlight/utils/hooks'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'

export type CreateInputType = { value?: string }

const CreateInput: React.FC<CreateInputType> = () => {
  const { setSelection } = useSpotlightContext()
  const { setSaved } = useContentStore(({ saved, setSaved }) => ({ saved, setSaved }))
  const { title, uid: nodeId } = useEditorStore((state) => state.node)
  // const uid = useEditorStore((state) => state.node.uid)

  const addILink = useDataStore((s) => s.addILink)

  const saveData = useSaveData()

  const setFsContent = useContentStore((state) => state.setContent)

  const pushToHistory = useHistoryStore((state) => state.push)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const editorState = useStoreEditorValue()

  const { loadNodeAndAppend, loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreate = (newNodeId: string) => {
    const newUid = addILink(newNodeId)
    setSelection(undefined)

    if (editorState) {
      setFsContent(newUid, editorState)
    }

    pushToHistory(newNodeId)
    addRecent(newNodeId)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, newNodeId)

    openNodeInMex(newNodeId)
    saveData()
    setSaved(true)
  }

  const handleChange = (nodeIdValue: string) => {
    const uid = getUidFromNodeId(nodeIdValue)
    if (nodeContent) {
      loadNodeAndAppend(uid, nodeContent)
    } else {
      loadNode(uid)
      pushToHistory(uid)
      addRecent(uid)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, uid)
    }
  }

  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect
        id="wd-spotlight-editor-search"
        name="wd-spotlight-editor-search"
        prefillLast
        placeholder={title}
        handleSelectItem={handleChange}
        handleCreateItem={handleOnCreate}
      />
    </StyledSpotlightInputWrapper>
  )
}

export default CreateInput
