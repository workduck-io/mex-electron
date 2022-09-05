import { IconifyIcon } from '@iconify/react'
import { DesignItem } from '../../../types/design'
import { LastOpenedState } from '../../../types/userPreference'

export interface SidebarListItem<T> extends DesignItem {
  // Used to calculate the last opened state once in the list item component
  data: T
  lastOpenedId?: string
  // Used to pass the state computed to the context menu
  lastOpenedState?: LastOpenedState

  /**
   * Icon to show when the user hovers over the icon
   */
  hoverIcon?: string | IconifyIcon
  onIconClick?: (id: string) => void
}

export interface SidebarListProps<T> {
  items: SidebarListItem<T>[]
  // Action on item click
  onClick: (itemId: string) => void

  // If present selected item will be active
  selectedItemId?: string

  // If true, the list will be preceded by the default item
  defaultItem?: SidebarListItem<T>

  // To render the context menu if the item is right-clicked
  ItemContextMenu?: (props: { item: SidebarListItem<T> }) => JSX.Element

  // Searches by title of the items
  showSearch?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  noMargin?: boolean
}
