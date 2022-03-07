import { getBlockAbove } from '@udecode/plate'
import {
  createPluginFactory,
  HotkeyPlugin,
  onKeyDownToggleElement,
  PlateEditor,
  WithOverride
} from '@udecode/plate-core'
import useTodoStore from '../../../store/useTodoStore'

export const ELEMENT_TODO_LI = 'action_item'

// * override TODOs
export const withTodos: WithOverride<any, HotkeyPlugin> = (editor: PlateEditor) => {
  const updateContent = useTodoStore.getState().updateContent
  const { onChange } = editor

  editor.onChange = () => {
    const entry = getBlockAbove(editor)
    if (!entry) return

    const block = entry[0]

    if (block.type === ELEMENT_TODO_LI) {
      updateContent(block.id, [block])
    }

    onChange()
  }

  return editor
}

const createTodoPlugin = createPluginFactory<HotkeyPlugin>({
  key: ELEMENT_TODO_LI,
  isElement: true,
  handlers: {
    onKeyDown: onKeyDownToggleElement
  },
  options: {
    hotkey: ['mod+opt+4', 'mod+shift+4']
  },
  withOverrides: withTodos,
  deserializeHtml: {
    getNode: (el, node) => {
      if (node.type !== ELEMENT_TODO_LI) return

      return {
        id: el.id,
        type: node.type,
        checked: el.getAttribute('data-slate-value')
      }
    }
  }
})

export default createTodoPlugin
