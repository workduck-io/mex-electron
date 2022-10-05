import { createPluginFactory, HotkeyPlugin, onKeyDownToggleElement } from '@udecode/plate-core'

import { ELEMENT_TODO_LI } from '@workduck-io/mex-utils'

import { withTodoOverride } from './withTodoOverride'

const createTodoPlugin = (withEntity: boolean) =>
  createPluginFactory<HotkeyPlugin>({
    key: ELEMENT_TODO_LI,
    isElement: true,
    handlers: {
      onKeyDown: onKeyDownToggleElement
    },
    withOverrides: withTodoOverride(withEntity),
    options: {
      hotkey: ['mod+opt+4', 'mod+shift+4']
    },
    deserializeHtml: {
      attributeNames: ['data-nodeid'],
      getNode: (el, node) => {
        if (node.type !== ELEMENT_TODO_LI) return

        return {
          id: el.id,
          type: node.type,
          nodeid: el.getAttribute('data-nodeid'),
          checked: el.getAttribute('data-slate-value')
        }
      }
    }
  })

export default createTodoPlugin
