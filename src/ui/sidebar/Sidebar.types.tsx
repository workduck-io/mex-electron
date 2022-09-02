import { DesignItem } from '../../types/design'
import { LastOpenedState } from '../../types/userPreference'
import { ILink } from '../../types/Types'

/**
 * A generic item to be shown in sidebar
 */
export interface FlatSidebarItem extends DesignItem {
  // Used to calculate the last opened state once in the list item component
  lastOpenedId?: string

  // Used to pass the state computed to the context menu
  lastOpenedState?: LastOpenedState
}

export interface SidebarFlatList {
  type: 'flat'
  renderItems: () => JSX.Element
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
