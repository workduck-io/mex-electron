import { IpcAction } from '@data/IpcAction'
import { useSaver } from '@editor/Components/Saver'
import useDataStore from '@store/useDataStore'
import { usePlateEditorRef } from '@udecode/plate'
import { getMexHTMLDeserializer } from '@utils/htmlDeserializer'
import { AppleNote } from '@utils/importers/appleNotes'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { ipcRenderer } from 'electron'
import { useState, useEffect } from 'react'
import { useLinks } from './useLinks'
import useLoad from './useLoad'

export const useImportExport = () => {
  const addILink = useDataStore((store) => store.addILink)
  const [appleNotes, setAppleNotes] = useState<AppleNote[]>([])

  const { onSave } = useSaver()
  const { goTo } = useRouting()
  const { getNode, loadNode } = useLoad()
  const { getNodeidFromPath } = useLinks()

  const editor = usePlateEditorRef()

  useEffect(() => {
    ipcRenderer.on(IpcAction.SET_APPLE_NOTES_DATA, (_event, arg: AppleNote[]) => {
      setAppleNotes(arg)
      const appleNotesUID = getNodeidFromPath('Apple Notes')
      loadNode(appleNotesUID)
      goTo(ROUTE_PATHS.node, NavigationType.push, appleNotesUID)
    })
  }, [])

  useEffect(() => {
    if (editor && appleNotes.length > 0) {
      const appleNotesParentKey = 'Apple Notes'

      appleNotes.forEach((note) => {
        const title = note.NoteTitle
        const nodeKey = `${appleNotesParentKey}.${title}`
        let nodeUID = addILink({ ilink: nodeKey }).nodeid

        const newNodeContent = getMexHTMLDeserializer(note.HTMLContent, editor, [])
        if (!nodeUID) nodeUID = getNodeidFromPath(nodeKey)

        const newNode = getNode(nodeUID)
        onSave(newNode, true, false, [{ children: newNodeContent }])
      })

      setAppleNotes([])
    }
  }, [appleNotes, editor])
}
