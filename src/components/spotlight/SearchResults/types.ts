import { CategoryType } from '../../../store/Context/context.spotlight'
import { IpcAction } from '../../../data/IpcAction'

export interface ListItemType {
  id: string
  icon: string
  title: string
  description?: string
  type: ItemActionType
  category: CategoryType
  shortcut?: string[]
  extras?: Partial<ItemExtraType>
}

export interface ItemExtraType {
  nodeid: string
  path: string
  new: boolean
  componentName: string
  base_url: string
  ipcAction: IpcAction
}

export enum ItemActionType {
  'search',
  'open',
  'render',
  'ilink',
  'action',
  'ipc',
  'browser_search'
}
