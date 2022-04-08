import { CategoryType } from '../../../store/Context/context.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { Shortcut } from '../../mex/Help/Help.types'
import { CalendarEvent } from '../../../hooks/useCalendar'

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
  customAction: () => void
  componentName: string
  base_url: string
  event: CalendarEvent
  ipcAction: IpcAction
}

export enum ItemActionType {
  search,
  open,

  /** **Twin Open**
  On Enter opens the nodeid
  On Meta+Enter opens the URL,
  */
  twinOpen,

  render,
  action,
  ipc,
  browser_search
}
