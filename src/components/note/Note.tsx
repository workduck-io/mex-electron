import React from 'react'

import EditorPreviewRenderer from '@editor/EditorPreviewRenderer'
import { useContentStore } from '@store/useContentStore'

const Note: React.FC<{ noteId: string }> = ({ noteId }) => {
  const getContent = useContentStore((store) => store.getContent)
  const noteContent = getContent(noteId)

  if (noteContent?.content) {
    return <EditorPreviewRenderer content={noteContent?.content} readOnly={true} editorId={`${noteId}_pinned_note`} />
  }
}

export default Note
