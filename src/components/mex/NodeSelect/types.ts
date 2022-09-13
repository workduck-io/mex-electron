import React from 'react'

import { SingleNamespace } from '../../../types/Types'

export type QuickLink = {
  // Text to be shown in the combobox list
  text: string

  // Value of the item. In this case NodeId
  value: string

  // Does it 'exist' or is it QuickLinkStatus.new
  status: QuickLinkStatus

  type?: QuickLinkType

  // Unique identifier
  // Not present if the node is not yet created i.e. QuickLinkStatus.new
  nodeid?: string
  namespace?: string

  icon?: string
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  snippet = 'Snippets',
  flow = 'Flows',
  tags = 'Tags',
  mentions = 'Mentions'
}
export enum QuickLinkStatus {
  new,
  exists
}

export interface NodeSelectProps {
  handleSelectItem: (item: QuickLink) => void
  handleCreateItem?: (item: QuickLink) => void
  id?: string
  name?: string
  disabled?: boolean
  inputRef?: any
  showAll?: boolean
  prefillRecent?: boolean
  /**
   * Whether to show menu as an overlay or inline
   * @default true
   */
  menuOverlay?: boolean

  menuOpen?: boolean
  /** If true, the combobox will be autofocused */
  autoFocus?: boolean
  /** If true, when autofocused, all text will be selected */
  autoFocusSelectAll?: boolean

  defaultValue?: string | undefined
  placeholder?: string

  /** Show icon highlig‸ht for whether an option has been selected */
  highlightWhenSelected?: boolean

  /** disallow input if reserved */
  disallowReserved?: boolean

  /** disallow input if clash */
  disallowClash?: boolean

  /** disallow input if match  */
  disallowMatch?: (path: string) => boolean

  /** Which highlight to show, true for selected (check) */
  iconHighlight?: boolean

  /** Add the create option at the top of the suggestions */
  createAtTop?: boolean

  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}
export interface NodeSelectState {
  inputItems: QuickLink[]
  namespaces: SingleNamespace[]
  selectedItem: QuickLink | null
  selectedNamespace: SingleNamespace | null
  reserved: boolean
  clash: boolean
  isMatch: boolean
}
export interface ReserveClashActionProps {
  path: string
  onReserve: (reserve: boolean) => void
  onClash: (clash: boolean) => void
  onMatch: (isMatch: boolean) => void
  onSuccess: () => void
}
