import { getNodes, insertNodes, TEditor } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
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

export const useTransform = () => {
  const addILink = useDataStore((s) => s.addILink)
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

  const replaceSelectionWithLink = (editor: TEditor, ilink: string) => {
    try {
      const selectionPath = Editor.path(editor, editor.selection)
      mog('replaceSelectionWithLink  selPath', { selectionPath })

      Transforms.removeNodes(editor, { at: editor.selection, mode: 'highest', hanging: true })
      mog('replaceSelectionWithLink  detFrag', { selectionPath })

      insertNodes<ILinkNode>(editor, [{ type: ELEMENT_ILINK, value: ilink, children: [] }], {
        at: editor.selection
      })
      mog('replaceSelectionWithLink  insNode', { selectionPath })
    } catch (e) {
      console.error(e)
      return e
    }
  }

  /**
   * Converts selection to new node
   * Inserts the link of new node in place of the selection
   * @param editor
   * @param key mark to toggle
   * @param clear marks to clear when adding mark
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

      const value = nodes.map(([node, _path]) => {
        return node
      })
      const text = convertContentToRawText(value, NODE_PATH_SPACER)
      const parentPath = useEditorStore.getState().node.title
      const path = parentPath + SEPARATOR + getSlug(text)

      const nodeid = addILink(path)

      // setNodes(editor, { type: ELEMENT_LINK, value: nodeid }, { at: selectionPath })
      replaceSelectionWithLink(editor, path)
      mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path, nodeid })
      setContent(nodeid, value)
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }

  return { selectionToNode, isConvertable }
}
