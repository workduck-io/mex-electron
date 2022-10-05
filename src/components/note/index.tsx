import React, { useEffect, useState } from 'react'

import { IpcAction } from '@data/IpcAction'
import { syncStoreState } from '@store/syncStore'
import { BroadcastSyncedChannel } from '@store/syncStore/types'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import useMultipleEditors from '@store/useEditorsStore'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { ipcRenderer } from 'electron'

import Header from './Header'
import Note from './Note'
import { NoteWindowLayout } from './styled'
import { useAnalysisIPC } from '@store/useAnalysis'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import useTodoStore from '@store/useTodoStore'

const NoteWindow = () => {
  const [noteId, setNoteId] = useState<string>(undefined)
  const content = useContentStore((store) => store.contents)
  const unPinNote = useMultipleEditors((store) => store.unPinNote)

  useEffect(() => {
    ipcRenderer.on(IpcAction.PIN_NOTE_WINDOW, (_event, data) => {
      if (data?.noteId) setNoteId(data.noteId)
    })

    syncStoreState(useContentStore, {
      name: BroadcastSyncedChannel.CONTENTS,
      sync: [{ field: 'contents' }],
      init: true
    })

    syncStoreState(useDataStore, {
      name: BroadcastSyncedChannel.DATA,
      sync: [
        { field: 'ilinks' },
        { field: 'tags' },
        { field: 'linkCache' },
        { field: 'tagsCache' },
        { field: 'archive' }
      ],
      init: true
    })

    syncStoreState(useUserPreferenceStore, {
      name: BroadcastSyncedChannel.USER_PROPERTIES,
      sync: [{ field: 'theme' }],
      init: true
    })

    syncStoreState(useTodoStore, {
      name: BroadcastSyncedChannel.TASKS,
      sync: [{ field: 'todos'}],
      init: true
    })

    syncStoreState(useTodoBufferStore, {
      name: BroadcastSyncedChannel.TASKS_BUFFER,
      sync: [{ field: 'todosBuffer' }],
      init: true
    })

    syncStoreState(useMultipleEditors, {
      name: BroadcastSyncedChannel.MULTIPLE_EDITORS,
      sync: [{ field: 'pinned' }],
      init: true
    })

    return () => {
      if (noteId) unPinNote(noteId)
    }
  }, [])

  useAnalysisIPC()

  if (!noteId) return <></>

  return (
    <NoteWindowLayout>
      <Header noteId={noteId} />
      <Note noteId={noteId} />
    </NoteWindowLayout>
  )
}

export default NoteWindow
