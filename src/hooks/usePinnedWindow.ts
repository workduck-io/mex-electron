import { IpcAction } from '@data/IpcAction'
import useMultipleEditors from '@store/useEditorsStore'
import { mog } from '@utils/lib/mog'
import { ipcRenderer } from 'electron'

const usePinnedWindows = () => {
  const pinNote = useMultipleEditors((store) => store.pinNote)
  const unPin = useMultipleEditors((store) => store.unPinNote)

  const isPinned = (noteId: string) => {
    if (noteId) return useMultipleEditors.getState().pinned?.has(noteId)
  }

  const onPinNote = (noteId: string) => {
    const isPinnedNote = isPinned(noteId)

    if (isPinnedNote) {
      ipcRenderer.send(IpcAction.SHOW_PINNED_NOTE_WINDOW, { data: { noteId } })
    } else {
      pinNote(noteId)
      mog('SENDING DATA', { noteId })
      ipcRenderer.send(IpcAction.PIN_NOTE_WINDOW, { data: { noteId } })
    }
  }

  const onUnpinNote = (noteId: string) => {
    const isPinnedNote = isPinned(noteId)

    if (isPinnedNote) {
      unPin(noteId)
      ipcRenderer.send(IpcAction.UNPIN_NOTE, { data: { noteId } })
    }
  }

  return {
    onPinNote,
    isPinned,
    onUnpinNote
  }
}

export default usePinnedWindows
