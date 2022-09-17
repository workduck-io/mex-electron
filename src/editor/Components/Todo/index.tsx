import React from 'react'

import { deleteText, getNodeEntries, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import { getNodeIdFromEditor } from '@utils/helpers'
import toast from 'react-hot-toast'
import { useReadOnly } from 'slate-react'

import { default as TodoBase } from '../../../ui/components/Todo'

<<<<<<< Updated upstream
const TodoElement = (props: any) => {
=======
<<<<<<< Updated upstream
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
=======
const TodoElement = React.forwardRef<any, any>((props, ref) => {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  const nodeid = getNodeIdFromEditor(editorId)

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
      ref={ref}
      {...rootProps}
      {...attributes}
      readOnly={readOnly}
      oid={'EditorTodo'}
      todoid={element.entityId}
      parentNodeId={nodeid}
      controls={{
        onDeleteClick
      }}
    >
      {children}
    </TodoBase>
  )
})

export default TodoElement
