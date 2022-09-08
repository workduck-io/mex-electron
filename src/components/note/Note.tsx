import React, { useCallback } from 'react'

import { useContentStore } from '@store/useContentStore'
import Editor from '@editor/Editor'
import { getDefaultContent } from '@components/spotlight/Preview'
import { useBufferStore, useEditorBuffer } from '@hooks/useEditorBuffer'

const Note: React.FC<{ noteId: string }> = ({ noteId }) => {
  const getContent = useContentStore((store) => store.getContent)
  const noteContent = getContent(noteId)

  const addOrUpdateValBuffer = useBufferStore(store => store.add)
  const { saveAndClearBuffer } = useEditorBuffer()

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && noteId !== '__null__') {
        addOrUpdateValBuffer(noteId, val)
      }
    },
    [noteId]
  )

  const onAutoSave = useCallback((val) => {
    saveAndClearBuffer(false)
  }, [])

  if (noteContent?.content) {
    return <Editor
      showBalloonToolbar
      onAutoSave={onAutoSave}
      onChange={onChangeSave}
      content={noteContent.content.length ? noteContent?.content : getDefaultContent()}
      editorId={`${noteId}-Pinned-Note`}
    />

  }
}

export default Note
