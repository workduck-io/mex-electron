import { MentionNodeData } from '@udecode/plate'
import { ComboboxKey } from '../combobox/useComboboxStore'

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data: MentionNodeData[]
}
