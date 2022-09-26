import { generateTaskEntityId } from '@data/Defaults/idPrefixes'
import { Value, PlateEditor, TNode, queryNode, ELEMENT_TODO_LI } from '@udecode/plate'

import { mog } from '@workduck-io/mex-utils'

import { EntityElements } from '../../../types/entities'

export const withTodoOverride = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
  const { apply } = editor

  editor.apply = (operation) => {
    mog('OPERATION', { operation })
    if (operation.type === 'set_node') {
      mog('Im here in set_node')
      // clone to be able to write (read-only)
      const node = { ...(operation.newProperties as any) }
      // the id in the new node is already being used in the editor, we need to replace it with a new id
      const isEntity = EntityElements.includes(node.type) && !node.entityId
      node['entityId'] = isEntity ? generateTaskEntityId() : undefined

      return apply({
        ...operation,
        newProperties: node
      })
    }

    if (operation?.type === 'insert_node') {
      const node = { ...operation?.node }

      if (node.type === ELEMENT_TODO_LI && node.entityId) {
        mog('RESUSDFJ SFJDSLFJLJLSDJFSDJFL: ')
        return apply({
          ...operation,
          node: {
            ...operation.node,
            entityId: generateTaskEntityId()
          }
        })
      }
    }

    if (operation.type === 'split_node') {
      mog('Im in split_node')
      const node = operation.properties as TNode

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
