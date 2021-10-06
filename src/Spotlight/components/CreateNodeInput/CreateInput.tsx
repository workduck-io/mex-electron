import { useStoreEditorValue } from '@udecode/plate-core'
import React from 'react'
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
  const nodeId = useEditorStore((state) => state.node.id)
  // const uid = useEditorStore((state) => state.node.uid)

  const addILink = useDataStore((s) => s.addILink)

  const saveData = useSaveData()

  const setFsContent = useContentStore((state) => state.setContent)

  const pushToHistory = useHistoryStore((state) => state.push)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const editorState = useStoreEditorValue()

  const { loadNodeAndAppend, loadNode } = useLoad()
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
    if (nodeContent) {
      loadNodeAndAppend(nodeIdValue, nodeContent)
    } else {
      loadNode(nodeIdValue)
      pushToHistory(nodeIdValue)
      addRecent(nodeIdValue)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeIdValue)
    }
  }

  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect prefillLast placeholder={nodeId} handleSelectItem={handleChange} handleCreateItem={handleOnCreate} />
    </StyledSpotlightInputWrapper>
  )
}

export default CreateInput
