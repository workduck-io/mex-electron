import {
  AnyObject,
  AutoformatRule,
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
  KEYS_HEADING,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateEditor,
  TEditor,
  getParent,
  getPluginType,
  insertEmptyCodeBlock,
  isBlockAboveEmpty,
  isElement,
  isSelectionAtBlockStart,
  isType,
  toggleList,
  unwrapList,
  AutoformatQueryOptions,
  autoformatSubscriptNumbers,
  autoformatComparison,
  autoformatEquality,
  autoformatFraction,
  autoformatSubscriptSymbols,
  autoformatSuperscriptNumbers,
  autoformatSuperscriptSymbols
} from '@udecode/plate'

import { ELEMENT_SYNC_BLOCK } from '../Components/SyncBlock'
import { generateTempId } from '../../data/Defaults/idPrefixes'

import { uploadImageToWDCDN } from '../../utils/imageUpload'
import { ELEMENT_ACTION_BLOCK } from '@editor/Components/Actions/types'
import { ELEMENT_INLINE_BLOCK } from '@editor/Components/InlineBlock/types'
import { SOURCE_PLUGIN } from '@editor/Components/Blocks/createBlockModifierPlugin'

const preFormat = (editor: TEditor<AnyObject>) => unwrapList(editor as PlateEditor)

/*
 * Returns true if the autoformat can be applied:
 * Is outside of code
 */
const formatQuery = (editor: TEditor<AnyObject>, options: AutoformatQueryOptions) => {
  const parentEntry = getParent(editor, editor.selection.focus)
  if (!parentEntry) return
  const [node] = parentEntry

  // mog('formatQuery', { editor, options, node })

  if (isElement(node) && node.type !== ELEMENT_CODE_LINE && node.type !== ELEMENT_CODE_BLOCK) {
    // mog('formatNodeConversion', {
    //   node,
    //   parentEntry
    // })
    return true
  }
  return false
}

export const optionsAutoFormatRule: Array<AutoformatRule> = [
  {
    mode: 'block',
    type: ELEMENT_H1,
    match: ['h1', 'H1'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H2,
    match: ['h2', 'H2'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H3,
    match: ['h3', 'H3'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H4,
    match: ['h4', 'H4'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H5,
    match: ['h5', 'H5'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H6,
    match: ['h6', 'H6'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['* ', '- '],
    query: formatQuery,
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
    query: formatQuery,
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
    match: '[]',
    query: formatQuery
  },
  {
    mode: 'block',
    type: ELEMENT_BLOCKQUOTE,
    match: ['>'],
    query: formatQuery,
    preFormat
  },
  {
    type: MARK_BOLD,
    match: ['**', '**'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_BOLD,
    match: ['__', '__'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_ITALIC,
    match: ['*', '*'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_ITALIC,
    match: ['_', '_'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_CODE,
    match: ['`', '`'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_STRIKETHROUGH,
    match: ['~~', '~~'],
    mode: 'mark',
    query: formatQuery
  },
  {
    mode: 'block',
    type: ELEMENT_CODE_BLOCK,
    match: '``',
    trigger: '`',
    triggerAtBlockStart: false,
    format: (editor: TEditor<AnyObject>) => {
      insertEmptyCodeBlock(editor as PlateEditor, {
        defaultType: getPluginType(editor as PlateEditor, ELEMENT_DEFAULT),
        insertNodesOptions: { select: true }
      })
    }
  }
]

export const optionsSoftBreakPlugin = {
  options: {
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
}

export const autoformatMath: AutoformatRule[] = [
  ...autoformatComparison,
  ...autoformatEquality,
  ...autoformatFraction,
  {
    mode: 'text',
    match: '+-',
    format: '±'
  },
  {
    mode: 'text',
    match: '%%',
    format: '‰'
  },
  {
    mode: 'text',
    match: ['%%%', '‰%'],
    format: '‱'
  },
  ...autoformatSuperscriptSymbols,
  ...autoformatSubscriptSymbols,
  ...autoformatSuperscriptNumbers,
  ...autoformatSubscriptNumbers
]

export const optionsExitBreakPlugin = {
  options: {
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
}

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH
}

export const optionsResetBlockTypePlugin = {
  options: {
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
}

export const optionsSelectOnBackspacePlugin = {
  options: { query: { allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED, ELEMENT_ACTION_BLOCK, ELEMENT_INLINE_BLOCK] } }
}

export const optionsCreateNodeIdPlugin = {
  options: {
    reuseId: true,
    filterText: false,
    idCreator: () => generateTempId(),
    exclude: [ELEMENT_SYNC_BLOCK]
  }
}

export const optionsImagePlugin = {
  options: {
    uploadImage: uploadImageToWDCDN
  }
}
