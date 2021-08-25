import React from 'react'
import { Combobox } from '../combobox/components/Combobox'
import { ComboboxItemProps, RenderFunction } from '../combobox/components/Combobox.types'
import { useComboboxControls } from '../combobox/hooks/useComboboxControls'
import { useComboboxStore } from '../combobox/useComboboxStore'

import { ComboTypeHandlers, useElementOnChange } from './useMultiComboboxOnKeyDown'

export interface ComboElementProps {
  keys: {
    [type: string]: ComboRenderType
  }
}
interface ComboRenderType {
  comboTypeHandlers: ComboTypeHandlers
  renderElement: RenderFunction<ComboboxItemProps>
}

export const ElementComboboxComponent = ({ keys }: ComboElementProps) => {
  const comboboxKey: string = useComboboxStore((state) => state.key)
  const comboRenderType = keys[comboboxKey]
  const onSelectItem = useElementOnChange(comboRenderType.comboTypeHandlers)

  return <Combobox onSelectItem={onSelectItem as any} onRenderItem={comboRenderType.renderElement} />
}

// Handle multiple combobox
export const MultiComboboxContainer = ({ keys }: ComboElementProps) => {
  useComboboxControls(true)

  return <ElementComboboxComponent keys={keys} />
}
