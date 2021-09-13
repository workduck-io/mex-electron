import React from 'react'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { useSaveData } from '../../../Data/useSaveData'
import { useStoreEditorValue } from '@udecode/plate-core'
import { StyledSearch } from '../Search/styled'
import { CenterIcon } from '../../../Spotlight/styles/layout'
import WDLogo from '../Search/Logo'
import CreateInput from './CreateInput'
import Message from '../Message'
import { openNodeInMex } from '../../../Spotlight/utils/hooks'
import { useHistoryStore } from '../../../Editor/Store/HistoryStore'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'

const CreateNodeInput = () => {
  const { setSelection } = useSpotlightContext()
  const { saved, setSaved } = useContentStore(({ saved, setSaved }) => ({ saved, setSaved }))
  const nodeId = useEditorStore((state) => state.node.id)

  const addILink = useDataStore((s) => s.addILink)

  const saveData = useSaveData()

  const setFsContent = useContentStore((state) => state.setContent)

  const pushToHistory = useHistoryStore((state) => state.push)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const editorState = useStoreEditorValue()

  const onCreate = (newNodeId: string) => {
    addILink(newNodeId)
    setSelection(undefined)

    if (editorState) {
      setFsContent(newNodeId, editorState)
    }

    saveData()
    setSaved(true)
    pushToHistory(newNodeId)
    addRecent(newNodeId)
    openNodeInMex(newNodeId)
  }

  return (
    <StyledSearch>
      <CreateInput onCreate={onCreate} placeholder={nodeId} />
      {saved && <Message text="Saved" />}
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default CreateNodeInput
