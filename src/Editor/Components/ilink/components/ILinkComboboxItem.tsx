import * as React from 'react'
import { ComboboxItemProps } from '../../combobox/components/Combobox.types'

export type ILinkComboboxItemData =
  | {
      isNew?: boolean
    }
  | undefined

export const ILinkComboboxItem = ({ item }: ComboboxItemProps) => {
  return !(item.data as ILinkComboboxItemData)?.isNew ? (
    item.text
  ) : (
    <div className="inline-flex items-center">
      New &quot;<span className="font-medium">{item.text}</span>&quot; node
    </div>
  )
}
