import { getNodes, getSelectionText, insertNodes, TEditor, upsertLinkAtSelection } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { SEPARATOR } from '../../../components/mex/Sidebar/treeUtils'
import { useSaveData } from '../../../hooks/useSaveData'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { mog } from '../../../utils/lib/helper'
import { getSlug, NODE_PATH_SPACER } from '../../../utils/lib/strings'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { ELEMENT_ILINK } from '../ilink/defaults'
import { ILinkNode } from '../ilink/types'
import { ELEMENT_SYNC_BLOCK } from '../SyncBlock'
import { generateSnippetId } from '../../../data/Defaults/idPrefixes'
import genereateName from 'project-name-generator'
import toast from 'react-hot-toast'
import { defaultContent } from '../../../data/Defaults/baseData'

export const useTransform = () => {
  const addILink = useDataStore((s) => s.addILink)
  const addSnippet = useSnippetStore((s) => s.addSnippet)
  const setContent = useContentStore((s) => s.setContent)
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
   * Converts selection to new node
   * Inserts the link of new node in place of the selection
   * @param editor
   */
  const selectionToNode = (editor: TEditor) => {
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
      const isInline = lowest.length === 1 && selText.length < 80

      const text = convertContentToRawText(value, NODE_PATH_SPACER)
      const parentPath = useEditorStore.getState().node.title
      const path = parentPath + SEPARATOR + (isInline ? getSlug(selText) : getSlug(text))

      const nodeid = addILink(path)

      replaceSelectionWithLink(editor, path, isInline)
      // mog('We are here', { lowest, selText, esl: editor.selection, selectionPath, nodes, value, text, path, nodeid })
      setContent(nodeid, isInline ? defaultContent.content : value)
      // saveData()
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
      // const text = convertContentToRawText(value, NODE_PATH_SPACER)
      // const parentPath = useEditorStore.getState().node.title
      // const path = parentPath + SEPARATOR + getSlug(text)

      // const nodeid = addILink(path)
      const snippetId = generateSnippetId()
      const snippetTitle = genereateName().dashed
      addSnippet({
        id: snippetId,
        title: snippetTitle,
        content: value
      })

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value })

      toast(`Snippet created '/snip.${snippetTitle}'`, { duration: 5000 })
      // setContent(nodeid, value)
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }

  return { selectionToNode, isConvertable, selectionToSnippet }
}
