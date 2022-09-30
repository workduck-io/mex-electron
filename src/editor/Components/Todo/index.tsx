import React from 'react'

import { getDefaultContent } from '@components/spotlight/Preview'
import { getBlockAbove, getPlateEditorRef, insertNode, removeNodes, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import { getNodeIdFromEditor } from '@utils/helpers'
import toast from 'react-hot-toast'
import { useReadOnly } from 'slate-react'

import { default as TodoBase } from '../../../ui/components/Todo'

const TodoElement = React.forwardRef<any, any>((props, ref) => {
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  const nodeid = getNodeIdFromEditor(editorId)

  const onDeleteClick = () => {
    const editor = getPlateEditorRef()

    if (editor) {
      try {
        removeNodes(editor, { at: [], mode: 'highest', match: (node) => element.id === node.id })
        const blockPresentAbove = getBlockAbove(editor)

        if (!blockPresentAbove) insertNode(editor, getDefaultContent())
      } catch (error) {
        toast('Unable to delete this todo')
      }
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

TodoElement.displayName = 'TodoElement'

export default TodoElement
