import IconButton from '@style/Buttons'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { EditorWrapper, NodeInfo, NoteTitle, StyledEditor } from '@style/Editor'
import React, { useMemo } from 'react'
import Editor from '@editor/Editor'
import { useMatch } from 'react-router-dom'
import { getContent } from '@utils/helpers'
import { defaultContent } from '@data/Defaults/baseData'
import { useLinks } from '@hooks/useLinks'

const ArchiveNoteEditor = () => {
  const { goBack } = useRouting()
  const match = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)

  const { getTitleFromNoteId } = useLinks()

  const onBackClick = () => {
    goBack()
  }

  const note = useMemo(() => {
    const nodeId = match.params.nodeid
    if (nodeId) {
      const content = getContent(nodeId)?.content
      const title = getTitleFromNoteId(nodeId, { includeArchived: true })
      return { content, title, nodeId }
    }

    return {
      title: 'No Title',
      content: defaultContent.content
    }
  }, [match.params])

  return (
    <StyledEditor className="archive_note_editor">
      <NodeInfo>
        <IconButton
          size={24}
          shortcut={`Esc`}
          icon={arrowLeftLine}
          onClick={onBackClick}
          title={'Return To Archives'}
        />
        <NoteTitle>{note.title}</NoteTitle>
      </NodeInfo>

      <EditorWrapper>
        <Editor
          options={{
            exclude: { mentions: false }
          }}
          readOnly
          focusAtBeginning={false}
          content={note.content}
          editorId={note.nodeId || note.title}
        />
      </EditorWrapper>
    </StyledEditor>
  )
}

export default ArchiveNoteEditor
