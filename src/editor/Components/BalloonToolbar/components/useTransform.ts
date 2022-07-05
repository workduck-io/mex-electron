import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { getNodes, getSelectionText, insertNodes, TEditor } from '@udecode/plate'
import { convertValueToTasks } from '@utils/lib/contentConvertTask'
import genereateName from 'project-name-generator'
import toast from 'react-hot-toast'
import { Editor, Transforms } from 'slate'
import { SEPARATOR } from '../../../../components/mex/Sidebar/treeUtils'
import { defaultContent } from '../../../../data/Defaults/baseData'
import { generateSnippetId, generateTempId } from '../../../../data/Defaults/idPrefixes'
import { useSaveData } from '../../../../hooks/useSaveData'
import { useContentStore } from '../../../../store/useContentStore'
import { useEditorStore } from '../../../../store/useEditorStore'
import { useSnippetStore } from '../../../../store/useSnippetStore'
import { NodeEditorContent } from '../../../../types/Types'
import { mog } from '../../../../utils/lib/helper'
import { getSlug, NODE_PATH_CHAR_LENGTH, NODE_PATH_SPACER } from '../../../../utils/lib/strings'
import { convertContentToRawText } from '../../../../utils/search/parseData'
import { ELEMENT_ILINK } from '../../ilink/defaults'
import { ILinkNode } from '../../ilink/types'
import { ELEMENT_QA_BLOCK } from '../../QABlock/createQAPlugin'
import { ELEMENT_SYNC_BLOCK } from '../../SyncBlock'

export const useTransform = () => {
  const addSnippet = useSnippetStore((s) => s.addSnippet)
  const setContent = useContentStore((s) => s.setContent)
  const { createNewNote } = useCreateNewNote()

  const { saveData } = useSaveData()
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

    Transforms.delete(editor)
    // If editor selection has flowblock it is not convertable
    insertNodes<any>(editor, [{ type: ELEMENT_QA_BLOCK, question, questionId, id: generateTempId(), children: [] }], {
      at: editor.selection
    })
  }

  const convertSelectionToQABlock = (editor: TEditor) => {
    try {
      const selectionPath = Editor.path(editor, editor.selection)
      const val = selectionToValue(editor)
      const valText = convertContentToRawText(val)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      Transforms.removeNodes(editor, { at: editor.selection, hanging: false })
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
      Transforms.removeNodes(editor, { at: editor.selection, hanging: false })
      Transforms.delete(editor)

      const convertedVal = convertValueToTasks(todoVal)
      mog('replaceSelectionWithTask  ', { todoVal, convertedVal })

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
      getNodes(editor, {
        block: true
      })
    ).reduce((p: boolean, [node, _path]: any) => {
      // mog('isConvertable', { editor, p, node, ifb: isFlowBlock(node) })
      return p || isFlowBlock(node)
    }, false)
  }

  const replaceSelectionWithLink = (editor: TEditor, ilink: string, inline: boolean) => {
    try {
      const selectionPath = Editor.path(editor, editor.selection)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      if (inline) Transforms.delete(editor)
      else Transforms.removeNodes(editor, { at: editor.selection, hanging: false })
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
      getNodes(editor, {
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

    Editor.withoutNormalizing(editor, () => {
      // const selectionPath = Editor.path(editor, editor.selection)
      const nodes = Array.from(
        getNodes(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )
      const lowest = Array.from(
        getNodes(editor, {
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

    Editor.withoutNormalizing(editor, () => {
      // const selectionPath = Editor.path(editor, editor.selection)
      const nodes = Array.from(
        getNodes(editor, {
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

    Editor.withoutNormalizing(editor, () => {
      const selectionPath = Editor.path(editor, editor.selection)
      const nodes = Array.from(
        getNodes(editor, {
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
      addSnippet({
        id: snippetId,
        title: snippetTitle,
        content: value,
        icon: 'ri:quill-pen-line'
      })

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value })

      toast(`Snippet created '${snippetTitle}'`, { duration: 5000 })
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
