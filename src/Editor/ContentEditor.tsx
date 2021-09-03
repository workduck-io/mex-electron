import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import saveLine from '@iconify-icons/ri/save-line'
import { useStoreEditorValue } from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { useSaveData } from '../Data/useSaveData'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import { useLinks } from './Actions/useLinks'
import Editor from './Editor'
import { useContentStore } from './Store/ContentStore'
import { useEditorStore } from './Store/EditorStore'

const ContentEditor = () => {
  const title = useEditorStore((state) => state.node.title)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)

  const setFsContent = useContentStore((state) => state.setContent)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editorState = useStoreEditorValue()
  const id = useEditorStore((state) => state.node.id)
  const { updateLinksFromContent } = useLinks()

  const fsContent = useEditorStore((state) => state.content)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, id])

  const saveData = useSaveData()

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    // setContent then save
    if (editorState) {
      setFsContent(id, editorState)
      updateLinksFromContent(id, editorState)
    }

    saveData()

    toast('Saved!', { duration: 1000 })
  }

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <NodeInfo>
          <NoteTitle>{title}</NoteTitle>
          <InfoTools>
            <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
            <IconButton
              size={24}
              icon={bubbleChartLine}
              title="Graph"
              highlight={showGraph}
              onClick={() => toggleGraph()}
            />
          </InfoTools>
        </NodeInfo>

        <Editor onSave={onSave} content={content} editorId={id} />
      </StyledEditor>
    </>
  )
}

export default ContentEditor
