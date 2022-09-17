import { generateTaskEntityId } from '@data/Defaults/idPrefixes'
import { EntityElements } from '../../../types/entities'
import { Value, PlateEditor, TNode, queryNode, ELEMENT_TODO_LI } from '@udecode/plate'
<<<<<<< Updated upstream
=======
import { mog } from '@utils/lib/helper'
>>>>>>> Stashed changes

export const withTodoOverride = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
  const { apply } = editor

  editor.apply = (operation) => {
    if (operation.type === 'set_node') {
      // clone to be able to write (read-only)
<<<<<<< Updated upstream
      const node = { ...(operation.newProperties as any) }
=======
      mog("calling this now")
      const node = { ...(operation.newProperties as any) }

>>>>>>> Stashed changes
      // the id in the new node is already being used in the editor, we need to replace it with a new id
      const isEntity = EntityElements.includes(node.type) && !node.entityId
      node['entityId'] = isEntity ? generateTaskEntityId() : undefined

      return apply({
        ...operation,
        newProperties: node
      })
    }

    if (operation.type === 'split_node') {
      const node = operation.properties as TNode

<<<<<<< Updated upstream
=======
      mog("CALLING SPLIT MODE")
>>>>>>> Stashed changes
      // only for elements (node with a type)`
      if (queryNode([node, []], {}) && node.type === ELEMENT_TODO_LI) {
        return apply({
          ...operation,
          properties: {
            ...operation.properties,
            entityId: generateTaskEntityId()
          }
        })
      }
    }

    return apply(operation)
  }

  return editor
}
