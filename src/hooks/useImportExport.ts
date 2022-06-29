import { mog } from '@utils/lib/helper'
import { createPlateEditor } from '@udecode/plate'

import { getMexHTMLDeserializer } from '@utils/htmlDeserializer'
import { AppleNote } from '@utils/importers/appleNotes'
import { useCreateNewNote } from './useCreateNewNote'
import components from '../editor/Components/components'
import getPlugins from '@editor/Plugins/plugins'
import useDataStore from '../store/useDataStore'
import { uploadImageToWDCDN } from '../utils/imageUpload'

// export type NewNoteOptions = {
//   path?: string
//   parent?: string
//   noteId?: string
//   noteContent?: NodeEditorContent
//   openedNotePath?: string
//   noRedirect?: boolean
// }

const HTMLParser = new DOMParser()

const sanitizeHTML = async (HTMLContent: string) => {
  const doc = HTMLParser.parseFromString(HTMLContent, 'text/html')

  for (const img of Array.from(doc.querySelectorAll('img'))) {
    const CDNLink = (await uploadImageToWDCDN(img.src, false)) as string
    img.src = CDNLink
  }

  const innerHTML = doc.documentElement.innerHTML

  return innerHTML
}

export const useImportExport = () => {
  const { createNewNote } = useCreateNewNote()
  const ilinks = useDataStore((store) => store.ilinks)

  const appleNotesToMexNotes = async (appleNotesData: AppleNote[]) => {
    const editor = createPlateEditor({
      plugins: getPlugins(components)
    })

    const parentILink = ilinks.find((ilink) => ilink.path === 'Apple Notes')
    const parentNote = parentILink ?? createNewNote({ path: 'Apple Notes', noRedirect: true })

    appleNotesData.forEach(async (note) => {
      const title = note.NoteTitle
      const sanitizedHTMLContent = await sanitizeHTML(note.HTMLContent)
      const noteContent = getMexHTMLDeserializer(sanitizedHTMLContent, editor)
      mog(`ImportingAppleNotes `, { editor, title, noteContent, parentNote })
      // console.log('note content: ', noteContent)

      const nodeOptions = { path: `${parentNote.path}.${title}`, noRedirect: true, noteContent: noteContent }
      createNewNote(nodeOptions)
    })
  }

  return { appleNotesToMexNotes }
}
