import React from 'react'

import { SlashCommandConfig } from '../SlashCommands/Types'
import { Combobox } from '../combobox/components/Combobox'
import { ComboboxItemProps, ComboboxOptions, RenderFunction } from '../combobox/components/Combobox.types'
import { useComboboxControls } from '../combobox/hooks/useComboboxControls'
import { getCreateableOnSelect } from '../combobox/hooks/useComboboxOnKeyDown'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { useOnSelectItem } from './useMultiComboboxOnKeyDown'



export const ElementComboboxComponent = ({ keys, slashCommands, internal, options }: ComboConfigData) => {
  const comboboxKey: string = useComboboxStore.getState().key
  const comboRenderType = keys[comboboxKey]

  const { elementChangeHandler: onSelectItem, isSlash } = useOnSelectItem(
    comboboxKey,
    slashCommands,
    comboRenderType,
    internal.commands
  )

  const onNewItem = (newItem, parentId?) => {
    return comboRenderType.newItemHandler(newItem, parentId)
  }

  const creatableOnSelectItem = getCreateableOnSelect(onSelectItem, onNewItem)

  return (
    <Combobox
      options={options}
      isSlash={isSlash}
      onSelectItem={isSlash ? (onSelectItem as any) : creatableOnSelectItem}
      onRenderItem={comboRenderType?.renderElement}
    />
  )
}

// Handle multiple combobox
export const MultiComboboxContainer = ({ config, options }: { config: ComboConfigData, options?: ComboboxOptions }) => {
  useComboboxControls(true)

  return <ElementComboboxComponent {...config} options={options} />
}
