import create from 'zustand'
import { NodeEditorContent } from '../types/Types'
import { useContentStore } from './useContentStore'
import { produce } from 'immer'
import { defaultContent } from '@data/Defaults/baseData'
import { devtools, persist } from 'zustand/middleware'

type EditorState = {
  blink?: boolean
  opend?: boolean
}

// Increase this value to allow more
// For now, it's user can pin only one Note on parent Note
const MAX_PINNED_NOTE_ALLOWED = 1

type NoteIdType = string

type MultipleEditors = {
  editors: Record<NoteIdType, EditorState> //* NoteId, isEditing
  contents: Record<NoteIdType, NodeEditorContent> //* NoteId, Note's content
  pinned: Record<NoteIdType, Array<NoteIdType>>
  setPinned: (pinned: Record<NoteIdType, Array<NoteIdType>>) => void
  pinNote: (pinAt: string, noteToPin: string) => void
  unPinNote: (pinnedAt: string, noteToUnpin: string) => void
  addEditor: (noteId: string) => void
  setContents: (contents: Record<string, NodeEditorContent>) => void
}

const useMultipleEditors = create<MultipleEditors>(
  devtools(
    persist(
      (set, get) => ({
        editors: {},
        contents: {},
        pinned: {},
        setPinned: (pinned) => set({ pinned }),
        unPinNote: (pinnedAt, noteToUnpin) => {
          if (!get().pinned[pinnedAt]) throw new Error('No pinned Note found')

          set(
            produce((draft) => {
              const existing = draft.pinned[pinnedAt].filter((noteId: NoteIdType) => noteId !== noteToUnpin)
              draft.pinned[pinnedAt] = existing
            })
          )
        },
        pinNote: (pinAt, noteToPin) => {
          set(
            produce((draft) => {
              const isNotePinned = draft.pinned[pinAt]?.find((noteId: NoteIdType) => noteId === noteToPin)
              if (isNotePinned) return
              draft.pinned[pinAt] = [...draft.pinned[pinAt], noteToPin]
            })
          )
        },
        addEditor: (noteId) => {
          const existingContent = useContentStore.getState().getContent(noteId)
          set(
            produce((draft) => {
              draft.editors[noteId] = {
                pinned: false,
                blink: false
              }
              draft.contents[noteId] = existingContent || defaultContent.content
            })
          )
        },
        setContents: (contents) => {
          set(
            produce((draft) => {
              draft.contents = contents
            })
          )
        }
      }),
      { name: 'MULTIPLE_EDITORS_STORE' }
    ),
    { name: 'Multiple Editors Store' }
  )
)

export default useMultipleEditors
