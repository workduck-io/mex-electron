import { MentionNodeData } from '@udecode/slate-plugins';
import { ComboboxKey } from '../combobox/useComboboxStore';

export interface ComboboxType {
  cbKey: ComboboxKey;
  trigger: string;
  data: MentionNodeData[];
}
