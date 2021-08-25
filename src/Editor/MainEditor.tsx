import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import linkIcon from '@iconify-icons/ri/link'
import more2Fill from '@iconify-icons/ri/more-2-fill'
import saveLine from '@iconify-icons/ri/save-line'
import shareLine from '@iconify-icons/ri/share-line'
import { useStoreEditorValue } from '@udecode/plate'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { useSaveData } from '../Data/useSaveData'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import Editor from './Editor'
import { useContentStore } from './Store/ContentStore'
import { useEditorStore } from './Store/EditorStore'

const MainEditor = () => {
  const title = useEditorStore((state) => state.node.title)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)

  const setFsContent = useContentStore((state) => state.setContent)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editorState = useStoreEditorValue()
  const id = useEditorStore((state) => state.node.id)

  const saveData = useSaveData()

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    // setContent then save
    if (editorState) setFsContent(id, editorState)
    saveData(useContentStore.getState().contents)

    toast('Saved!', { duration: 1000 })
  }

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <NodeInfo>
          <NoteTitle>{title}</NoteTitle>
          <InfoTools>
            <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
            <IconButton size={24} icon={shareLine} title="Share" />
            <IconButton size={24} icon={linkIcon} title="Copy Link" />
            <IconButton size={24} icon={more2Fill} title="Options" />
            <IconButton
              size={24}
              icon={bubbleChartLine}
              title="Graph"
              highlight={showGraph}
              onClick={() => toggleGraph()}
            />
          </InfoTools>
        </NodeInfo>

        <Editor />
      </StyledEditor>
    </>
  )
}

export default MainEditor
