import { ILink } from '../../types/Types'

/**
 * A generic item to be shown in sidebar
 */
export interface FlatSidebarItem {
  id: string
  label: string
}

export interface SidebarFlatList {
  type: 'flat'
  items: FlatSidebarItem[]
}
export interface SidebarNestedList {
  type: 'hierarchy'
  items: ILink[]
}

export type SidebarMainList = SidebarFlatList | SidebarNestedList

/**
 * A single namespace to be shown in the sidebar
 */
export interface SidebarSpace {
  /**
   * ID of the space
   */
  id: string

  /**
   * Icon of the space
   */
  icon?: string

  /**
   * Label of the space
   */
  label: string

  /**
   * Tooltip on hovering over the space icon in space switcher
   */
  tooltip?: string

  /**
   * Shortcut to navigate to the space
   */
  shortcut?: string

  /**
   * The main list content of a space
   */
  list: SidebarMainList

  /**
   * Default Item for a space
   * Shown before the pinned items
   */
  defaultItem?: FlatSidebarItem

  /**
   * Items of a space that have been pinned
   */
  pinnedItems: FlatSidebarItem[]

  /**
   * Tags that have been used most often in a given space
   */
  popularTags?: string[]
}
