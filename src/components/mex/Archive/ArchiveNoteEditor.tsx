import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { EditorWrapper, NodeInfo, NoteTitle, StyledEditor } from '@style/Editor'
import React, { useMemo } from 'react'
import Editor from '@editor/Editor'
import trashIcon from '@iconify/icons-codicon/trash'
import archiveIcon from '@iconify/icons-ri/archive-line'

import { useMatch } from 'react-router-dom'
import { getContent } from '@utils/helpers'
import { defaultContent } from '@data/Defaults/baseData'
import { useLinks } from '@hooks/useLinks'
import { MexIcon } from '@style/Layouts'
import { FlexGap } from './styled'
import useArchive from '@hooks/useArchive'
import { useDelete } from '@hooks/useDelete'
import toast from 'react-hot-toast'
import { IconButton } from '@workduck-io/mex-components'

const ArchiveNoteEditor = () => {
  const match = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)

  const { goBack } = useRouting()
  const { getMockDelete } = useDelete()
  const { removeArchiveData } = useArchive()
  const { getTitleFromNoteId } = useLinks()

  const onBackClick = () => {
    goBack()
  }

  const handleDelete = async (nodeId: string) => {
    const notesToDelete = getMockDelete(nodeId)

    try {
      await removeArchiveData(notesToDelete)
    } catch (err) {
      toast('Error deleting Note')
    }
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
          transparent={false}
          title="Return To Archives"
        />
        <FlexGap>
          <MexIcon noHover height={24} width={24} icon={archiveIcon} />
          <NoteTitle>{note.title}</NoteTitle>
        </FlexGap>
        <IconButton
          transparent={false}
          color="#df7777"
          size={24}
          icon={trashIcon}
          onClick={() => handleDelete(note.nodeId)}
          title="Delete Permanently"
        />
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
