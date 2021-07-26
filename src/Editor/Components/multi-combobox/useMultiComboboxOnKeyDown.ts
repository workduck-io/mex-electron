import {
  getBlockAbove,
  getSlatePluginType,
  insertNodes,
  SPEditor,
  TElement,
} from '@udecode/slate-plugins';
import { useCallback } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { IComboboxItem } from '../combobox/components/Combobox.types';
import { useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown';
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen';
import { useComboboxStore } from '../combobox/useComboboxStore';

const useMultiComboboxOnKeyDown = (keys: {
  [type: string]: {
    slateElementType: string;
    newItemHandler: (newItem: string) => any;
  };
}) => {
  const comboboxKey: string = useComboboxStore((state) => state.key);
  const comboType = keys[comboboxKey];

  // We need to create the select handlers ourselves here

  const isOpen = useComboboxIsOpen();
  const targetRange = useComboboxStore((state) => state.targetRange);
  const closeMenu = useComboboxStore((state) => state.closeMenu);

  const useElementOnChange = useCallback(
    (editor: SPEditor & ReactEditor, item: IComboboxItem) => {
      const type = getSlatePluginType(editor, comboType.slateElementType);

      if (isOpen && targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1];
        const isBlockEnd =
          editor.selection &&
          pathAbove &&
          Editor.isEnd(editor, editor.selection.anchor, pathAbove);

        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ');
        }

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange);
        insertNodes<TElement>(editor, {
          type: type as any,
          children: [{ text: '' }],
          value: item.text,
        });
        // console.log({ type, item });

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
    [closeMenu, isOpen, targetRange]
  );

  return useComboboxOnKeyDown({
    // Handle multiple combobox
    onSelectItem: useElementOnChange,
    onNewItem: (newItem) => {
      comboType.newItemHandler(newItem);
    },
  });
};

export default useMultiComboboxOnKeyDown;
