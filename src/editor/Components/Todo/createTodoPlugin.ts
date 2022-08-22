import { createPluginFactory, HotkeyPlugin, onKeyDownToggleElement } from '@udecode/plate-core'
import { withTodoOverride } from './withTodoOverride'

export const ELEMENT_TODO_LI = 'action_item'

const createTodoPlugin = createPluginFactory<HotkeyPlugin>({
  key: ELEMENT_TODO_LI,
  isElement: true,
  handlers: {
    onKeyDown: onKeyDownToggleElement
  },
  withOverrides: withTodoOverride,
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
