import { ListItemType } from '@components/spotlight/SearchResults/types'
import { BaseRange } from 'slate'
import { QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { CategoryType } from '../../../store/Context/context.spotlight'
import { ComboboxKey } from '../combobox/useComboboxStore'

export enum SlashType {
  embed = 'media_embed',
  table = 'table',
  canvas = 'excalidraw',
  remind = 'remind'
}

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: QuickLinkType | CategoryType

  /** submenu data -> Takes the data to render submenu */
  submenu?: ComboboxItem[]

  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean

  // Inserted to element if present
  additional?: Record<string, any>
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data?: ComboboxItem[]
  extras?: Record<string, any>
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
