import { SPEditor } from '@udecode/slate-plugins';
import { ReactEditor } from 'slate-react';
import { IComboboxItem } from '../combobox/components/Combobox.types';
import { useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown';
import { useComboboxStore } from '../combobox/useComboboxStore';

const useMultiComboboxOnKeyDown = (keys: {
  [type: string]: {
    selectHandler: () => (
      editor: SPEditor & ReactEditor,
      item: IComboboxItem
    ) => void;
    newItemHandler: (newItem: string) => any;
  };
}) => {
  const comboboxKey: string = useComboboxStore((state) => state.key);
  const comboType = keys[comboboxKey];

  return useComboboxOnKeyDown({
    // Handle multiple combobox
    onSelectItem: comboType.selectHandler,
    onNewItem: (newItem) => {
      comboType.newItemHandler(newItem);
    },
  });
};

export default useMultiComboboxOnKeyDown;
