import { ComboboxItemProps } from '../combobox/components/Combobox.types';

export type ISlashComboboxItemData =
  | {
      isNew?: boolean;
    }
  | undefined;

export const SlashComboboxItem = ({ item }: ComboboxItemProps) => {
  return !(item.data as ISlashComboboxItemData)?.isNew ? item.text : null;
};
