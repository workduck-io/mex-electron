import React from 'react'

import { deleteText, getNodeEntries, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import { getNodeIdFromEditor } from '@utils/helpers'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import { useReadOnly } from 'slate-react'

import { default as TodoBase } from '../../../ui/components/Todo'

const TodoElement = (props: any) => {
  const { attributes, children, element } = props

  mog('TODO ELMENT IS ', { element })

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
}

export default TodoElement
