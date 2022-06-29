import { mog } from '@utils/lib/helper'
import { createPlateEditor, createPlateUI } from '@udecode/plate'

import { useSaver } from '@editor/Components/Saver'
import { getMexHTMLDeserializer } from '@utils/htmlDeserializer'
import { AppleNote } from '@utils/importers/appleNotes'
import { useRouting } from '@views/routes/urls'
import { useCreateNewNote } from './useCreateNewNote'
import { useLinks } from './useLinks'
import useLoad from './useLoad'
import { CopyTag } from '../editor/Components/tag/components/CopyTag'
import { ELEMENT_TAG } from '../editor/Components/tag/defaults'
import components from '../editor/Components/components'
import getPlugins from '@editor/Plugins/plugins'
import useDataStore from '../store/useDataStore'

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
  const ilinks = useDataStore((store) => store.ilinks)

  const appleNotesToMexNotes = async (appleNotesData: AppleNote[]) => {
    const editor = createPlateEditor({
      plugins: getPlugins(
        createPlateUI({
          [ELEMENT_TAG]: CopyTag as any
        }),
        {
          exclude: { dnd: true }
        }
      )
    })

    const parentILink = ilinks.find((ilink) => ilink.path === 'Apple Notes')
    const parentNote = parentILink ?? createNewNote({ path: 'Apple Notes', noRedirect: true })

    appleNotesData.forEach((note) => {
      const title = note.NoteTitle
      const noteContent = getMexHTMLDeserializer(note.HTMLContent, editor, [])
      mog(`ImportingAppleNotes `, { editor, title, noteContent, parentNote })
      console.log('note content: ', noteContent)

      const nodeOptions = { path: `${parentNote.path}.${title}`, noRedirect: true, noteContent: noteContent }
      const res = createNewNote(nodeOptions)
    })
  }

  return { appleNotesToMexNotes }
}
