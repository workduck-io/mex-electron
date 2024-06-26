import { useOpenToast } from '@components/toast/showOpenToasts'
import { cleanEditorId } from '@editor/Components/Todo'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useSnippets } from '@hooks/useSnippets'
import { useUpdater } from '@hooks/useUpdater'
import { useNoteContext } from '@store/Context/context.note'
import useDataStore from '@store/useDataStore'
import {
  deleteText,
  getNodeEntries,
  getNodeFragment,
  getPath,
  getSelectionText,
  insertNodes,
  removeNodes,
  TEditor,
  withoutNormalizing
} from '@udecode/plate'
import { convertValueToTasks } from '@utils/lib/contentConvertTask'
import genereateName from 'project-name-generator'
import { SEPARATOR } from '../../../../components/mex/Sidebar/treeUtils'
import { generateSnippetId, generateTempId } from '../../../../data/Defaults/idPrefixes'
import { NodeEditorContent } from '../../../../types/Types'
import { getSlug, NODE_PATH_SPACER } from '../../../../utils/lib/strings'
import { convertContentToRawText } from '../../../../utils/search/parseData'
import { ELEMENT_ILINK } from '../../ilink/defaults'
import { ILinkNode } from '../../ilink/types'
import { ELEMENT_QA_BLOCK } from '../../QABlock/createQAPlugin'

export const useTransform = () => {
  // const addSnippet = useSnippetStore((s) => s.addSnippet)
  // const node = useEditorStore((s) => s.node)
  const { openNoteToast, openSnippetToast } = useOpenToast()
  const { updateSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { updater } = useUpdater()
  const pinnedNoteCtx = useNoteContext()
  // const { toast } = useToast()

  const addQABlock = (editor: TEditor, block: { question: string; questionId: string }): boolean => {
    if (!editor) return false
    if (!editor?.selection) return false
    const { question, questionId } = block

    deleteText(editor)
    // If editor selection has flowblock it is not convertable
    insertNodes<any>(editor, [{ type: ELEMENT_QA_BLOCK, question, questionId, id: generateTempId(), children: [] }], {
      at: editor.selection
    })
  }

  const convertSelectionToQABlock = (editor: TEditor) => {
    try {
      // const selectionPath = getPath(editor, editor.selection)
      const val = selectionToValue(editor)
      const valText = convertContentToRawText(val)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      removeNodes(editor, { at: editor.selection, hanging: false })
      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      // mog('replaceSelectionWithQA  ', { selectionPath, val, valText })
      //
      addQABlock(editor, { question: valText, questionId: generateSnippetId() })
    } catch (e) {
      console.error(e)
      return e
    }
  }

  const replaceSelectionWithTask = (editor: TEditor, todoVal: NodeEditorContent) => {
    try {
      removeNodes(editor, { at: editor.selection, mode: 'highest' })

      const convertedVal = convertValueToTasks(todoVal)
      // mog('replaceSelectionWithTask  ', { todoVal, convertedVal })

      insertNodes<any>(editor, convertedVal, {
        at: editor.selection
      })
      // addQABlock(editor, { question: valText, questionId: generateSnippetId() })
    } catch (e) {
      console.error(e)
      return e
    }
  }
  // Checks whether current editor selection can be converted
  const isConvertable = (editor: TEditor): boolean => {
    if (!editor) return false
    if (!editor?.selection) return false
    // If editor selection has flowblock it is not convertable
    return !Array.from(
      getNodeEntries(editor, {
        block: true
      })
    ).reduce((p: boolean, [node, _path]: any) => {
      // mog('isConvertable', { editor, p, node })
      return p
    }, false)
  }

  const replaceSelectionWithLink = (editor: TEditor, ilink: string, inline: boolean) => {
    try {
      const selectionPath = getPath(editor, editor.selection)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      if (inline) deleteText(editor)
      else removeNodes(editor, { at: editor.selection, hanging: true, mode: 'highest' })
      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      // mog('replaceSelectionWithLink  detFrag', { selectionPath })

      insertNodes<ILinkNode>(editor, [{ type: ELEMENT_ILINK, value: ilink, children: [] }], {
        at: editor.selection
      })
      // mog('replaceSelectionWithLink  insNode', { sel: editor.selection })
    } catch (e) {
      console.error(e)
      return e
    }
  }

  /**
   * Converts selection to Value
   * @param editor
   */
  const selectionToValue = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    const nodes = Array.from(
      getNodeEntries(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    return value
  }

  /**
   * Converts selection to new node
   * Inserts the link of new node in place of the selection
   * @param editor
   */
  const selectionToNode = (editor: TEditor, title?: string) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    withoutNormalizing(editor, () => {
      // const selectionPath = getPath(editor, editor.selection)
      const nodes = Array.from(
        getNodeEntries(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )
      const lowest = Array.from(
        getNodeEntries(editor, {
          mode: 'lowest',
          block: true,
          at: editor.selection
        })
      )

      const selText = getSelectionText(editor)

      const isInline = lowest.length === 1
      // Only query for lowest value if selection is inline
      const lowestValue = isInline ? getNodeFragment(editor, editor.selection) : []
      const value = isInline
        ? lowestValue
        : nodes.map(([node, _path]) => {
            return node
          })

      const text = convertContentToRawText(value, NODE_PATH_SPACER)

      const editorId = editor.id as string
      const nodeid = cleanEditorId(editorId)

      const ilinks = useDataStore.getState().ilinks
      const node = ilinks.find((n) => n.nodeid === nodeid)

      if (node) {
        const parentPath = node.path
        const namespace = node.namespace
        const childTitle = title ?? (isInline ? getSlug(selText) : getSlug(text))
        const path = parentPath + SEPARATOR + childTitle

        //         mog('selectionToNode  ', {
        //           parentPath,
        //           lowest,
        //           lowestValue,
        //           value,
        //           childTitle,
        //           path,
        //           namespace,
        //           editorId,
        //           nodeid
        //         })

        const note = createNewNote({
          path,
          noteContent: value,
          namespace: namespace,
          noRedirect: true
        })

        replaceSelectionWithLink(editor, note?.nodeid, isInline)

        if (note) {
          openNoteToast(note.nodeid, note.path)
        }
      }
    })
  }

  /**
   * Converts selection to new Task
   * @param editor
   */
  const selectionToTask = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    withoutNormalizing(editor, () => {
      // const selectionPath = getPath(editor, editor.selection)
      const nodes = Array.from(
        getNodeEntries(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )

      const value = nodes.map(([node, _path]) => {
        return node
      })

      replaceSelectionWithTask(editor, value)

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }
  /**
   * Converts selection to new snippet
   * Shows notification of snippet creation
   * @param editor
   */
  const selectionToSnippet = (editor: TEditor, title?: string) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    withoutNormalizing(editor, () => {
      const selectionPath = getPath(editor, editor.selection)
      const nodes = Array.from(
        getNodeEntries(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )

      const value = nodes.map(([node, _path]) => {
        return node
      })

      const snippetId = generateSnippetId()
      const snippetTitle = title ?? genereateName().dashed
      const newSnippet = {
        id: snippetId,
        title: snippetTitle,
        content: value,
        icon: 'ri:quill-pen-line'
      }
      updateSnippet(newSnippet)
      updater()
      // addSnippet()

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value })
      //
      openSnippetToast(snippetId, snippetTitle)

      // setContent(nodeid, value)
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }

  return {
    selectionToNode,
    convertSelectionToQABlock,
    isConvertable,
    selectionToSnippet,
    selectionToTask,
    selectionToValue
  }
}
