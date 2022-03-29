import { BaseRange } from 'slate'
import { QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { CategoryType } from '../../../store/Context/context.spotlight'
import { ComboboxKey } from '../combobox/useComboboxStore'

export enum SlashType {
  embed = 'media_embed',
  table = 'table',
  canvas = 'excalidraw'
}

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: QuickLinkType | CategoryType
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data: ComboboxItem[]
  blockTrigger?: string
}

export interface ComboTriggerDataType {
  range: BaseRange
  search: ComboSearchType
  isBlockTriggered: boolean
  blockRange: BaseRange
  key: string
}

export interface ComboSearchType {
  textAfterTrigger: string
  textAfterBlockTrigger?: string
}
