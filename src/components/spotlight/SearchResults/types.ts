import { CategoryType } from '../../../store/Context/context.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { Shortcut } from '../../mex/Help/Help.types'
import { CalendarEvent } from '../../../hooks/useCalendar'
import { AuthTypeId } from '@workduck-io/action-request-helper'

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
  blockid: string
  path: string
  // New Note
  new: boolean
  // New Task
  newTask: boolean
  namespace: string
  actionGroup?: {
    actionGroupId: string
    authTypeId: AuthTypeId
  }
  combo: boolean
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

  /** Custom Action
   * the action function attached is run on selecting
   */
  customAction,

  render,
  action,
  ipc,
  browser_search
}
