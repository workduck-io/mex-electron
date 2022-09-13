import type { BaseRange } from 'slate'

import { QuickLinkType } from '../../../components/mex/NodeSelect/types'
import type { CategoryType } from '../../../store/Context/context.spotlight'
import { ComboboxKey } from '../combobox/types'



export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: QuickLinkType | CategoryType

  /** submenu data -> Takes the data to render submenu */
  submenu?: ComboboxItem[]

  extras?: any

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
