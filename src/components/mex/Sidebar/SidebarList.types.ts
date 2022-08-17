import { IconifyIcon } from "@iconify/react"

export interface SidebarListItem {
  id: string
  title: string
  icon?: string | IconifyIcon
  // tooltip?: string
}

export interface SidebarListProps {
  items: SidebarListItem[]
  // Action on item click
  onClick: (itemId: string) => void

  // If present selected item will be active
  selectedItemId?: string

  // If true, the list will be preceded by the default item
  defaultItem?: SidebarListItem

  // To render the context menu if the item is right-clicked
  ItemContextMenu?: (props: { item: SidebarListItem }) => JSX.Element

  // Searches by title of the items
  showSearch?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  noMargin?: boolean
}

