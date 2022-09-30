import { generateTaskEntityId } from '@data/Defaults/idPrefixes'
import { debounce } from 'lodash'
import {
  Value,
  PlateEditor,
  TNode,
  queryNode,
  ELEMENT_TODO_LI,
  TDescendant,
  TOperation,
  getNode,
  getNodeParent,
  getParentNode
} from '@udecode/plate'

import { mog } from '@workduck-io/mex-utils'

import { EntityElements } from '../../../types/entities'

const onNodeSet = <N extends TDescendant>(operation: TOperation<N>, apply: any): void => {
  // clone to be able to write (read-only)
  const nodeStateInEditor = { ...(operation.newProperties as any) }

  // the id in the new node is already being used in the editor, we need to replace it with a new id
  const isEntity = EntityElements.includes(nodeStateInEditor.type) && !nodeStateInEditor?.entityId
  nodeStateInEditor['entityId'] = isEntity ? generateTaskEntityId() : undefined

  return apply({
    ...operation,
    newProperties: nodeStateInEditor
  })
}

const onNodeInsert = <N extends TDescendant>(operation: TOperation<N>, apply: any): void => {
  const node = { ...(operation?.node as any) }

  if (node.type === ELEMENT_TODO_LI) {
    return apply({
      ...operation,
      node: {
        ...node,
        entityId: generateTaskEntityId()
      }
    })
  }
}

const onNodeSplit = <N extends TDescendant>(operation: TOperation<N>, apply: any): void => {
  const node = operation.properties as TNode

  // only for elements (node with a type)`
  if (queryNode([node, []], {}) && node?.type === ELEMENT_TODO_LI) {
    return apply({
      ...operation,
      properties: {
        ...node,
        entityId: generateTaskEntityId()
      }
    })
  }
}

export const withTodoOverride =
  (withEntity = true) =>
  <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
    if (!withEntity) return editor

    const { apply } = editor

    let hasAnyDebounce

    editor.apply = (operation) => {
      mog('OPERATION', { operation })
      switch (operation.type) {
        case 'set_node':
          onNodeSet(operation, apply)

        // no-fallthrough
        case 'insert_node':
          onNodeInsert(operation, apply)

        // no-fallthrough
        case 'split_node':
          onNodeSplit(operation, apply)

        // no-fallthrough
        default:
          if (hasAnyDebounce) {
            // hasAnyDebounce.cancel()
            hasAnyDebounce(operation)
          } else {
            hasAnyDebounce = debounce((operation) => {
              const node = getParentNode(editor, operation.path)
              mog('operation performing', { operation, node })
            }, 4000)
          }

          return apply(operation)
      }
    }

    return editor
  }
