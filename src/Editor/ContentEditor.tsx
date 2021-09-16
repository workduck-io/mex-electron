import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import { SaverButton } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'

const ContentEditor = () => {
  const title = useEditorStore((state) => state.node.title)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const id = useEditorStore((state) => state.node.id)
  const fsContent = useEditorStore((state) => state.content)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, id])

  const onSave = () => {
    // Callback after save
  }

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <NodeInfo>
          <NoteTitle>{title}</NoteTitle>
          <InfoTools>
            <SaverButton callbackAfterSave={onSave} />
            <IconButton
              size={24}
              icon={bubbleChartLine}
              title="Graph"
              highlight={showGraph}
              onClick={() => toggleGraph()}
            />
          </InfoTools>
        </NodeInfo>

        <Editor showBalloonToolbar content={content} editorId={id} />
      </StyledEditor>
    </>
  )
}

export default ContentEditor
