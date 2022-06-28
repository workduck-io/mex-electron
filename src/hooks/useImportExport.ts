import { usePlateEditorRef } from '@udecode/plate'

import { useSaver } from '@editor/Components/Saver'
import { getMexHTMLDeserializer } from '@utils/htmlDeserializer'
import { AppleNote } from '@utils/importers/appleNotes'
import { useRouting } from '@views/routes/urls'
import { useCreateNewNote } from './useCreateNewNote'
import { useLinks } from './useLinks'
import useLoad from './useLoad'

// export type NewNoteOptions = {
//   path?: string
//   parent?: string
//   noteId?: string
//   noteContent?: NodeEditorContent
//   openedNotePath?: string
//   noRedirect?: boolean
// }

export const useImportExport = () => {
  const { createNewNote } = useCreateNewNote()

  const editor = usePlateEditorRef()

  const appleNotesToMexNotes = async (appleNotesData: AppleNote[]) => {
    const parentNodeOptions = { path: 'Apple Notes', noRedirect: true }
    const parentNote = createNewNote(parentNodeOptions)

    appleNotesData.forEach((note) => {
      const title = note.NoteTitle
      const noteContent = getMexHTMLDeserializer(note.HTMLContent, editor, [])

      console.log('note content: ', noteContent)

      const nodeOptions = { path: `Apple Notes.${title}`, noRedirect: true, noteContent: noteContent }
      const res = createNewNote(nodeOptions)
    })
  }

  return { appleNotesToMexNotes }
}
