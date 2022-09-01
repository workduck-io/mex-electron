import create from 'zustand'
import { produce } from 'immer'
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
  isEmpty: boolean
  isEditingAnyPreview: () => boolean
  setIsEmpty: (status: boolean) => void
  changeEditorState: (noteId: string, editorState: EditorState) => void
  removeEditor: (noteId: string) => void
  lastOpenedEditor: () => any | undefined
}

const useMultipleEditors = create<MultipleEditors>(
  devtools(
    (set, get) => ({
      editors: {},
      pinned: {},
      isEmpty: true,
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
      setIsEmpty: (status) => set({ isEmpty: status }),
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
        set(
          produce((draft) => {
            draft.editors[noteId] = {
              editing: false,
              blink: false
            }
            draft.isEmpty = false
          })
        )
      },
      isEditingAnyPreview: () => {
        const currentState = get().editors || {}
        const isEditing = Object.values(currentState)?.find((item) => item.editing)

        return !!isEditing
      },
      lastOpenedEditor: () => {
        const editors = get().editors || {}
        const mapOfEditors = Object.entries(editors)
        if (mapOfEditors.length > 0)
          return {
            nodeId: mapOfEditors.at(-1)[0],
            editorState: mapOfEditors.at(-1)[1]
          }
      },
      removeEditor: (noteId) => {
        const currentState = useBufferStore.getState().buffer?.[noteId]
        useBufferStore.getState().add(noteId, currentState)

        set(
          produce((draft) => {
            delete draft.editors[noteId]
            if (!draft.editors || Object.entries(draft.editors).length === 0) {
              draft.editors = {}
              draft.isEmpty = true
            }
          })
        )
      },
      changeEditorState: (noteId, editorState) => {
        set(
          produce((draft) => {
            const existingState = draft.editors[noteId]
            draft.editors[noteId] = { ...(existingState || {}), ...editorState }
          })
        )
      }
    }),
    { name: 'Multiple Editors Store' }
  )
)

export default useMultipleEditors
