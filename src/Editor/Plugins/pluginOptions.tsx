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
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  getParent,
  getPlatePluginType,
  insertEmptyCodeBlock,
  isBlockAboveEmpty,
  isElement,
  isSelectionAtBlockStart,
  isType,
  KEYS_HEADING,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  SPEditor,
  TEditor,
  toggleList,
  unwrapList,
  WithAutoformatOptions,
} from '@udecode/plate';

const preFormat = (editor: TEditor<AnyObject>) =>
  unwrapList(editor as SPEditor);

export const optionsAutoformat: WithAutoformatOptions = {
  rules: [
    {
      type: ELEMENT_H1,
      markup: '#',
      preFormat,
    },
    {
      type: ELEMENT_H2,
      markup: '##',
      preFormat,
    },
    {
      type: ELEMENT_H3,
      markup: '###',
      preFormat,
    },
    {
      type: ELEMENT_H4,
      markup: '####',
      preFormat,
    },
    {
      type: ELEMENT_H5,
      markup: '#####',
      preFormat,
    },
    {
      type: ELEMENT_H6,
      markup: '######',
      preFormat,
    },
    {
      type: ELEMENT_LI,
      markup: ['*', '-'],
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            isElement(node) &&
            !isType(editor as SPEditor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor as SPEditor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor as SPEditor, {
              type: ELEMENT_UL,
            });
          }
        }
      },
    },
    {
      type: ELEMENT_LI,
      markup: ['1.', '1)'],
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            isElement(node) &&
            !isType(editor as SPEditor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor as SPEditor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor as SPEditor, {
              type: ELEMENT_OL,
            });
          }
        }
      },
    },
    {
      type: ELEMENT_TODO_LI,
      markup: ['[]'],
    },
    {
      type: ELEMENT_BLOCKQUOTE,
      markup: ['>'],
      preFormat,
    },
    {
      type: MARK_BOLD,
      between: ['**', '**'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: MARK_BOLD,
      between: ['__', '__'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: MARK_ITALIC,
      between: ['*', '*'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: MARK_ITALIC,
      between: ['_', '_'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: MARK_CODE,
      between: ['`', '`'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: MARK_STRIKETHROUGH,
      between: ['~~', '~~'],
      mode: 'inline',
      insertTrigger: true,
    },
    {
      type: ELEMENT_CODE_BLOCK,
      markup: '``',
      trigger: '`',
      triggerAtBlockStart: false,
      preFormat,
      format: (editor: TEditor<AnyObject>) => {
        insertEmptyCodeBlock(editor as SPEditor, {
          defaultType: getPlatePluginType(editor as SPEditor, ELEMENT_DEFAULT),
          insertNodesOptions: { select: true },
        });
      },
    },
  ],
};

export const optionsSoftBreakPlugin = {
  rules: [
    { hotkey: 'shift+enter' },
    {
      hotkey: 'enter',
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
      },
    },
  ],
};

export const optionsExitBreakPlugin = {
  rules: [
    {
      hotkey: 'mod+enter',
    },
    {
      hotkey: 'mod+shift+enter',
      before: true,
    },
    {
      hotkey: 'enter',
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING,
      },
    },
  ],
};

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

export const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Enter',
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Backspace',
      predicate: isSelectionAtBlockStart,
    },
  ],
};

export const optionsSelectOnBackspacePlugin = { allow: [ELEMENT_IMAGE] };
