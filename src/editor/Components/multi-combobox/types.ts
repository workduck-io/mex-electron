import { ComboboxKey } from '../combobox/useComboboxStore'

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data: ComboboxItem[]
}
