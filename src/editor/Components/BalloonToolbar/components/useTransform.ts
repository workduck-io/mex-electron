import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useSnippets } from '@hooks/useSnippets'
import { useToast } from '@hooks/useToast'
import { useUpdater } from '@hooks/useUpdater'
import {
  getSelectionText,
  insertNodes,
  TEditor,
  getNodeEntries,
  removeNodes,
  deleteText,
  getPath,
  withoutNormalizing
} from '@udecode/plate'
import { convertValueToTasks } from '@utils/lib/contentConvertTask'
import genereateName from 'project-name-generator'
import { SEPARATOR } from '../../../../components/mex/Sidebar/treeUtils'
import { defaultContent } from '../../../../data/Defaults/baseData'
import { generateSnippetId, generateTempId } from '../../../../data/Defaults/idPrefixes'
import { useEditorStore } from '../../../../store/useEditorStore'
import { useSnippetStore } from '../../../../store/useSnippetStore'
import { NodeEditorContent } from '../../../../types/Types'
import { getSlug, NODE_PATH_CHAR_LENGTH, NODE_PATH_SPACER } from '../../../../utils/lib/strings'
import { convertContentToRawText } from '../../../../utils/search/parseData'
import { ELEMENT_ILINK } from '../../ilink/defaults'
import { ILinkNode } from '../../ilink/types'
import { ELEMENT_QA_BLOCK } from '../../QABlock/createQAPlugin'
import { ELEMENT_SYNC_BLOCK } from '../../SyncBlock'

export const useTransform = () => {
  const addSnippet = useSnippetStore((s) => s.addSnippet)
  const { updateSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { updater } = useUpdater()
  const { toast } = useToast()

  // Checks whether a node is a flowblock
  const isFlowBlock = (node: any): boolean => {
    if (node.type === ELEMENT_SYNC_BLOCK) return true
    if (node.children) {
      if (node.children.length > 0)
        return node.children.map(isFlowBlock).reduce((p: boolean, c: boolean) => p || c, false)
    }
    return false
  }

  // Checks whether current editor selection can be converted
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
      // mog('isConvertable', { editor, p, node, ifb: isFlowBlock(node) })
      return p || isFlowBlock(node)
    }, false)
  }

  const replaceSelectionWithLink = (editor: TEditor, ilink: string, inline: boolean) => {
    try {
      const selectionPath = getPath(editor, editor.selection)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      if (inline) deleteText(editor)
      else removeNodes(editor, { at: editor.selection, hanging: false })
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
  const selectionToNode = (editor: TEditor) => {
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

      const value = nodes.map(([node, _path]) => {
        return node
      })
      const isInline = lowest.length === 1
      const putContent = selText.length > NODE_PATH_CHAR_LENGTH

      const text = convertContentToRawText(value, NODE_PATH_SPACER)
      const parentPath = useEditorStore.getState().node.title
      const path = parentPath + SEPARATOR + (isInline ? getSlug(selText) : getSlug(text))

      const note = createNewNote({ path, noteContent: putContent ? value : defaultContent.content, noRedirect: true })

      replaceSelectionWithLink(editor, note?.nodeid, isInline)
      // mog('Replace Selection with node We are here', {
      //   lowest,
      //   selText,
      //   esl: editor.selection,
      //   selectionPath,
      //   nodes,
      //   value,
      //   text,
      //   path
      // })
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
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
  const selectionToSnippet = (editor: TEditor) => {
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
      const snippetTitle = genereateName().dashed
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

      toast(`Snippet created [[${snippetTitle}]]`)
      // setContent(nodeid, value)
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }

  return {
    selectionToNode,
    convertSelectionToQABlock,
    isConvertable,
    isFlowBlock,
    selectionToSnippet,
    selectionToTask,
    selectionToValue
  }
}
