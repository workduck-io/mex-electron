import create from 'zustand'
import { useContentStore } from './useContentStore'
import { produce } from 'immer'
import { defaultContent } from '@data/Defaults/baseData'
import { devtools } from 'zustand/middleware'
import { useBufferStore } from '@hooks/useEditorBuffer'

type EditorState = {
  blink?: boolean
  editing?: boolean
}

type NoteIdType = string

type MultipleEditors = {
  editors: Record<NoteIdType, EditorState> //* NoteId, isEditing
  pinned: Record<NoteIdType, Array<NoteIdType>>
  setPinned: (pinned: Record<NoteIdType, Array<NoteIdType>>) => void
  pinNote: (pinAt: string, noteToPin: string) => void
  unPinNote: (pinnedAt: string, noteToUnpin: string) => void
  addEditor: (noteId: string) => void
  changeEditorState: (noteId: string, editorState: EditorState) => void
  removeEditor: (noteId: string) => void
}

const useMultipleEditors = create<MultipleEditors>(
  devtools(
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
              editing: false,
              blink: false
            }
            draft.contents[noteId] = existingContent || defaultContent.content
          })
        )
      },
      removeEditor: (noteId) => {
        const currentState = useBufferStore.getState().buffer?.[noteId]
        useBufferStore.getState().add(noteId, currentState)

        set(
          produce((draft) => {
            delete draft.editors[noteId]
          })
        )
      },
      changeEditorState: (noteId, editorState) => {
        set(
          produce((draft) => {
            const existingState = draft.editors[noteId]
            if (existingState) draft.editors[noteId] = { ...existingState, ...editorState }
          })
        )
      }
    }),
    { name: 'Multiple Editors Store' }
  )
)

export default useMultipleEditors
