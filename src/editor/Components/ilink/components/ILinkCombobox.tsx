import * as React from 'react'
import { ComboboxKey } from "../../combobox/types"
import { Combobox } from '../../combobox/components/Combobox'
import { useComboboxStore } from '../../combobox/useComboboxStore'
import { useILinkOnSelectItem } from '../hooks/useILinkOnSelectItem'
import { ILinkComboboxItem } from './ILinkComboboxItem'

export const ILinkComboboxComponent = () => {
  const onSelectItem = useILinkOnSelectItem()

  return <Combobox onSelectItem={onSelectItem as any} onRenderItem={ILinkComboboxItem} />
}

export const ILinkCombobox = () => {
  const key = useComboboxStore((state) => state.key)

  return (
    <div style={key !== ComboboxKey.INTERNAL ? { display: 'none' } : {}}>
      <ILinkComboboxComponent />
    </div>
  )
}
