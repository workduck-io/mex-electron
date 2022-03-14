import { getParent, insertNodes, PlateEditor, PlatePluginKey, TElement } from '@udecode/plate-core'
import { generateTempId } from '../../../../data/Defaults/idPrefixes'
import { ELEMENT_EXCALIDRAW } from '../createExcalidrawPlugin'
import { ExcalidrawNodeData } from '../types'

export const insertExcalidraw = (
  editor: PlateEditor,
  { key = ELEMENT_EXCALIDRAW }: Partial<ExcalidrawNodeData> & PlatePluginKey
): void => {
  if (!editor.selection) return

  const selectionParentEntry = getParent(editor, editor.selection)
  if (!selectionParentEntry) return

  const [, path] = selectionParentEntry

  insertNodes<TElement<ExcalidrawNodeData>>(
    editor,
    {
      id: generateTempId(),
      type: key,
      children: [{ text: '' }]
    },
    { at: path }
  )
}
