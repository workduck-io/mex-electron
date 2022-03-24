import { debounce } from 'lodash'
import {
  createPluginFactory,
  HotkeyPlugin,
  onKeyDownToggleElement,
  PlateEditor,
  WithOverride
} from '@udecode/plate-core'
import { useEditorStore } from '../../../store/useEditorStore'
import useTodoStore from '../../../store/useTodoStore'
import { getTodosFromContent } from '../../../utils/lib/content'

export const ELEMENT_TODO_LI = 'action_item'

// * override TODOs
export const withTodos: WithOverride<any, HotkeyPlugin> = (editor: PlateEditor) => {
  const updateTodos = useTodoStore.getState().replaceContentOfTodos

  const nodeid = useEditorStore.getState().node.nodeid

  const { onChange } = editor

  const updateTodosFromContent = debounce(() => {
    const editorTodoBlocks = getTodosFromContent(editor.children)
    updateTodos(nodeid, editorTodoBlocks)
  }, 1000)

  editor.onChange = () => {
    onChange()
    // updateTodosFromContent()
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
