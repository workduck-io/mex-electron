import React, { useMemo, useCallback, useEffect } from 'react'

import { getDefaultContent } from '@components/spotlight/Preview'
import { IpcAction } from '@data/IpcAction'
import { Editor } from '@editor/Editor'
import { useEditorBuffer } from '@hooks/useEditorBuffer'
import { NoteProvider } from '@store/Context/context.note'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { ipcRenderer } from 'electron'

import { tinykeys } from '@workduck-io/tinykeys'

import { NodeEditorContent } from '../../types/Types'
import InfoBar from './InfoBar'
import { EditorContainer, NoteBodyContainer } from './styled'

const Note: React.FC<{ noteId: string }> = ({ noteId }) => {
  const noteContentInfo = useContentStore((store) => store.contents?.[noteId])
  const archive = useDataStore((store) => store.archive)

  const archived = useMemo(() => {
    const res = archive.find((a) => a.nodeid === noteId)
    return !!res
  }, [noteId, archive])

  const { saveAndClearBuffer, addOrUpdateValBuffer } = useEditorBuffer()

  const onChangeSave = useCallback(
    async (val: NodeEditorContent) => {
      if (val && noteId !== '__null__') {
        addOrUpdateValBuffer(noteId, val)
      }
    },
    [noteId]
  )

  const onAutoSave = useCallback((val: NodeEditorContent) => {
    saveAndClearBuffer(false)
  }, [])

  const noteContent = useMemo(() => {
    const content = noteContentInfo?.content?.length ? noteContentInfo?.content : [getDefaultContent()]
    return content
  }, [noteContentInfo])

  useEffect(() => {
    ipcRenderer.on(IpcAction.WINDOW_BLUR, () => {
      saveAndClearBuffer()
    })

    const unsubscribe = tinykeys(window, {
      '$mod+S': (event) => {
        event.preventDefault()
        saveAndClearBuffer(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <NoteBodyContainer>
      <EditorContainer>
        <InfoBar archived={archived} />
        <NoteProvider>
          <Editor
            showBalloonToolbar
            onAutoSave={onAutoSave}
            comboboxOptions={{ showPreview: false }}
            onChange={onChangeSave}
            content={noteContent}
            options={{ exclude: { dnd: true } }}
            padding="0.25rem"
            readOnly={archived}
            editorId={`${noteId}-Pinned-Note`}
          />
        </NoteProvider>
      </EditorContainer>
    </NoteBodyContainer>
  )
}

export default Note