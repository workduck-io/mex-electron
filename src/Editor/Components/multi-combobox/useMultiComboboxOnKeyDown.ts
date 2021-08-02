import {
  getBlockAbove,
  getPlatePluginType,
  insertNodes,
  SPEditor,
  TElement,
} from '@udecode/plate';
import { useCallback } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { IComboboxItem } from '../combobox/components/Combobox.types';
import { useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown';
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen';
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore';
import { SlashCommandConfig } from '../SlashCommands/Types';
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange';

export interface ComboTypeHandlers {
  slateElementType: string;
  newItemHandler: (newItem: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useElementOnChange = (comboType: ComboTypeHandlers) => {
  const isOpen = useComboboxIsOpen();
  const targetRange = useComboboxStore((state) => state.targetRange);
  const closeMenu = useComboboxStore((state) => state.closeMenu);

  return useCallback(
    (editor: SPEditor & ReactEditor, item: IComboboxItem) => {
      const type = getPlatePluginType(editor, comboType.slateElementType);

      if (isOpen && targetRange) {
        // console.log('useElementOnChange 1', { comboType, type });

        const pathAbove = getBlockAbove(editor)?.[1];
        const isBlockEnd =
          editor.selection &&
          pathAbove &&
          Editor.isEnd(editor, editor.selection.anchor, pathAbove);

        // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ');
        }

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange);
        insertNodes<TElement>(editor, {
          type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          children: [{ text: '' }],
          value: item.text,
        });

        // console.log('Inserted', { item, type });

        // move the selection after the ilink element
        Transforms.move(editor);

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor);
        }

        return closeMenu();
      }
      return undefined;
    },
    [closeMenu, isOpen, targetRange, comboType]
  );
};

const useMultiComboboxOnKeyDown = (
  keys: {
    [type: string]: ComboTypeHandlers;
  },
  slashCommands: {
    [type: string]: SlashCommandConfig;
  }
) => {
  const comboboxKey: string = useComboboxStore((state) => state.key);
  const comboType = keys[comboboxKey];
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands);
  const elementOnChange = useElementOnChange(comboType);

  // We need to create the select handlers ourselves here

  const elementChangeHandler =
    comboboxKey === ComboboxKey.SLASH_COMMAND
      ? slashCommandOnChange
      : elementOnChange;

  return useComboboxOnKeyDown({
    // Handle multiple combobox
    onSelectItem: elementChangeHandler,
    onNewItem: (newItem) => {
      comboType.newItemHandler(newItem);
    },
  });
};

export default useMultiComboboxOnKeyDown;
