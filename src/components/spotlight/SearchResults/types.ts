import { CategoryType } from '../../../store/Context/context.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { Shortcut } from '../../mex/Help/Help.types'

export interface ListItemType {
  id: string
  icon: string
  title: string
  description?: string
  type: ItemActionType | QuickLinkType
  category: CategoryType
  shortcut?: Record<string, Shortcut>
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
  search,
  open,
  render,
  action,
  ipc,
  browser_search
}
