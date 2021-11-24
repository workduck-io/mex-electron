import {
  AnyObject,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_IMAGE,
  ELEMENT_LI,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  getParent,
  getPluginType,
  insertEmptyCodeBlock,
  isBlockAboveEmpty,
  isElement,
  isSelectionAtBlockStart,
  isType,
  KEYS_HEADING,
  KEY_AUTOFORMAT,
  KEY_EXIT_BREAK,
  KEY_NODE_ID,
  KEY_RESET_NODE,
  KEY_SOFT_BREAK,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateEditor,
  TEditor,
  toggleList,
  unwrapList
} from '@udecode/plate'
import { generateTempId } from '../../Defaults/idPrefixes'
import { ELEMENT_SYNC_BLOCK } from '../Components/SyncBlock'

const preFormat = (editor: TEditor<AnyObject>) => unwrapList(editor as PlateEditor)

export const optionsAutoformat = {
  key: KEY_AUTOFORMAT,
  rules: [
    {
      mode: 'block',
      type: ELEMENT_H1,
      match: 'h1',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_H2,
      match: 'h2',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_H3,
      match: 'h3',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_H4,
      match: 'h4',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_H5,
      match: 'h5',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_H6,
      match: 'h6',
      preFormat
    },
    {
      mode: 'block',
      type: ELEMENT_LI,
      match: ['*', '-'],
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection)
          if (!parentEntry) return
          const [node] = parentEntry
          if (
            isElement(node) &&
            !isType(editor as PlateEditor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor as PlateEditor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor as PlateEditor, {
              type: ELEMENT_UL
            })
          }
        }
      }
    },
    {
      mode: 'block',
      type: ELEMENT_LI,
      match: ['1.', '1)'],
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection)
          if (!parentEntry) return
          const [node] = parentEntry
          if (
            isElement(node) &&
            !isType(editor as PlateEditor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor as PlateEditor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor as PlateEditor, {
              type: ELEMENT_OL
            })
          }
        }
      }
    },
    {
      mode: 'block',
      type: ELEMENT_TODO_LI,
      match: ['[]']
    },
    {
      mode: 'block',
      type: ELEMENT_BLOCKQUOTE,
      match: ['>'],
      preFormat
    },
    {
      type: MARK_BOLD,
      match: ['**', '**'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      type: MARK_BOLD,
      match: ['__', '__'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      type: MARK_ITALIC,
      match: ['*', '*'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      type: MARK_ITALIC,
      match: ['_', '_'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      type: MARK_CODE,
      match: ['`', '`'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      type: MARK_STRIKETHROUGH,
      match: ['~~', '~~'],
      mode: 'mark',
      insertTrigger: true
    },
    {
      mode: 'block',
      type: ELEMENT_CODE_BLOCK,
      match: '``',
      trigger: '`',
      triggerAtBlockStart: false,
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        insertEmptyCodeBlock(editor as PlateEditor, {
          defaultType: getPluginType(editor as PlateEditor, ELEMENT_DEFAULT),
          insertNodesOptions: { select: true }
        })
      }
    }
  ]
}

export const optionsSoftBreakPlugin = {
  key: KEY_SOFT_BREAK,
  rules: [
    { hotkey: 'shift+enter' },
    {
      hotkey: 'enter',
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD]
      }
    }
  ]
}

export const optionsExitBreakPlugin = {
  key: KEY_EXIT_BREAK,
  rules: [
    {
      hotkey: 'mod+enter'
    },
    {
      hotkey: 'mod+shift+enter',
      before: true
    },
    {
      hotkey: 'enter',
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING
      }
    }
  ]
}

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH
}

export const optionsResetBlockTypePlugin = {
  key: KEY_RESET_NODE,
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Enter',
      predicate: isBlockAboveEmpty
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Backspace',
      predicate: isSelectionAtBlockStart
    }
  ]
}

export const optionsSelectOnBackspacePlugin = { allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED] }

export const optionsCreateNodeIdPlugin = {
  key: KEY_NODE_ID,
  reuseId: true,
  filterText: false,
  idCreator: () => generateTempId(),
  exclude: [ELEMENT_SYNC_BLOCK]
}
