import useModalStore, { ModalsType } from '@store/useModalStore'
import { deleteText, getNodeEntries, getNodes, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import { mog } from '@workduck-io/mex-utils'
import React from 'react'
import toast from 'react-hot-toast'
import { useReadOnly } from 'slate-react'
import { NODE_ID_PREFIX, SNIPPET_PREFIX } from '../../../data/Defaults/idPrefixes'
import { default as TodoBase } from '../../../ui/components/Todo'

export const cleanEditorId = (editorId: string) => {
  /*
   * Find substring of form NODE_{} in editorid
   */
  const nodeReg = new RegExp(`${NODE_ID_PREFIX}_[A-Za-z0-9]+`)
  const nodeIdReg = editorId?.match(nodeReg)
  // mog('nodeId', { nodeIdReg, editorId })
  if (nodeIdReg) {
    return nodeIdReg[0]
  }

  const snippetReg = new RegExp(`${SNIPPET_PREFIX}_[A-Za-z0-9]+`)
  const snippetnodeidReg = editorId?.match(snippetReg)
  // mog('nodeId', { snippetReg, snippetnodeidReg })

  if (snippetnodeidReg) {
    return snippetnodeidReg[0]
  }
}

const Todo = (props: any) => {
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)
  const hideDelete = useModalStore((m) => m.open === ModalsType.todo)

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  // const nodeid = useEditorStore((store) => store.node.nodeid)
  const nodeid = cleanEditorId(editorId)

  const showDelete = !hideDelete && !readOnly

  // mog('Todo', { nodeid, editorId, readOnly, hideDelete, showDelete })

  const onDeleteClick = () => {
    const editor = getPlateEditorRef()
    const blockNode = getNodeEntries(editor, {
      at: [],
      match: (node) => element.id === node.id,
      block: true
    })
    try {
      const [_, path] = Array.from(blockNode)[0]
      deleteText(editor, { at: [path[0]] })
      editor.insertText('')
    } catch (error) {
      toast('Unable to delete this todo')
    }
  }

  return (
    <TodoBase
      {...rootProps}
      {...attributes}
      readOnly={readOnly}
      oid={'EditorTodo'}
      todoid={element?.id}
      element={element}
      readOnlyContent={readOnly}
      showDelete={showDelete}
      showPriority
      parentNodeId={nodeid}
      controls={{
        onDeleteClick
      }}
    >
      {children}
    </TodoBase>
  )
}

export default Todo
