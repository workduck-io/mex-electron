import { ListItemType } from '@components/spotlight/SearchResults/types'
import { BaseRange } from 'slate'
import { QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { CategoryType } from '../../../store/Context/context.spotlight'
import { ComboboxItemProps, RenderFunction } from '../combobox/components/type'
import { ComboboxKey } from '../combobox/type'
import { SlashCommandConfig } from '../SlashCommands/Types'

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

export interface ComboConfigData {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
  internal: {
    ilink: SingleComboboxConfig
    commands: ConfigDataSlashCommands
  }
}

export interface ConfigDataKeys {
  [type: string]: SingleComboboxConfig
}

export interface ConfigDataSlashCommands {
  [type: string]: SlashCommandConfig
}
export interface SingleComboboxConfig {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?: any) => any | Promise<any>
  // Called when an item is inserted, Not called when a new item is inserted, use newItemHandler to handle the new item case
  onItemInsert?: (item: string) => any
  renderElement: RenderFunction<ComboboxItemProps>
}

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}