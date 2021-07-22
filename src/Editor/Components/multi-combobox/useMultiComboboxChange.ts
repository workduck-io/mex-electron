import {
  MentionNodeData,
  OnChange,
  TEditor,
  useStoreEditorRef,
} from '@udecode/slate-plugins';
import { useCallback } from 'react';
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen';
import { useComboboxStore } from '../combobox/useComboboxStore';

// Handle multiple combobox
const useMultiComboboxOnChange = (
  editorId: string,
  keys: {
    [type: string]: {
      handler: (editor: TEditor, data: MentionNodeData[]) => () => boolean;
      data: MentionNodeData[];
    };
  }
): OnChange => {
  const editor = useStoreEditorRef(editorId)!;

  const isOpen = useComboboxIsOpen();
  const closeMenu = useComboboxStore((state) => state.closeMenu);

  const comboboxKey: string = useComboboxStore((state) => state.key);
  const comboType = keys[comboboxKey];
  const changeHandler = comboType && comboType.handler(editor, comboType.data);

  return useCallback(
    () => () => {
      console.log({ changeHandler, comboboxKey });

      let changed: boolean | undefined = false;
      changed = changeHandler !== undefined ? changeHandler() : false;
      if (changed) return;

      if (!changed && isOpen) closeMenu();
    },
    [closeMenu, isOpen, changeHandler, keys, comboboxKey]
  );
};

export default useMultiComboboxOnChange;
