import { getNodes, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import React, { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Transforms } from 'slate'
import { useReadOnly } from 'slate-react'
import { NODE_ID_PREFIX, SNIPPET_PREFIX } from '../../../data/Defaults/idPrefixes'
import { useEditorStore } from '../../../store/useEditorStore'
import useTodoStore from '../../../store/useTodoStore'
import { default as TodoBase } from '../../../ui/components/Todo'
import { mog } from '../../../utils/lib/helper'
import { useRouting } from '../../../views/routes/urls'

const cleanEditorId = (editorId: string) => {
  /*
   * Find substring of form NODE_{} in editorid
   */
  const nodeReg = new RegExp(`${NODE_ID_PREFIX}_[A-Za-z0-9]+`)
  const nodeIdReg = editorId.match(nodeReg)
  // mog('nodeId', { nodeIdReg, editorId })
  if (nodeIdReg) {
    return nodeIdReg[0]
  }

  const snippetReg = new RegExp(`${SNIPPET_PREFIX}_[A-Za-z0-9]+`)
  const snippetnodeidReg = editorId.match(snippetReg)
  // mog('nodeId', { snippetReg, snippetnodeidReg })
  if (snippetnodeidReg) {
    return snippetnodeidReg[0]
  }
}

const Todo = (props: any) => {
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  // const nodeid = useEditorStore((store) => store.node.nodeid)
  const nodeid = cleanEditorId(editorId)

  const onDeleteClick = () => {
    const editor = getPlateEditorRef()
    const blockNode = getNodes(editor, {
      at: [],
      match: (node) => element.id === node.id,
      block: true
    })
    try {
      const [_, path] = Array.from(blockNode)[0]
      Transforms.delete(editor, { at: [path[0]] })
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
      todoid={element.id}
      parentNodeId={nodeid}
      onDeleteClick={onDeleteClick}
    >
      {children}
    </TodoBase>
  )
}

export default Todo
