import React from 'react'

import { SlashCommandConfig } from '../SlashCommands/Types'
import { Combobox } from '../combobox/components/Combobox'
import { ComboboxItemProps, ComboboxOptions, RenderFunction } from '../combobox/components/Combobox.types'
import { useComboboxControls } from '../combobox/hooks/useComboboxControls'
import { getCreateableOnSelect } from '../combobox/hooks/useComboboxOnKeyDown'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { useOnSelectItem } from './useMultiComboboxOnKeyDown'

export interface ComboConfigData {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
  internal: {
    ilink: SingleComboboxConfig
    commands: ConfigDataSlashCommands
  }
  options?: ComboboxOptions
}

export interface ConfigDataKeys {
  [type: string]: SingleComboboxConfig
}

export interface ConfigDataSlashCommands {
  [type: string]: SlashCommandConfig
}
export interface SingleComboboxConfig {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?: any) => any | Promise<any>
  // Called when an item is inserted, Not called when a new item is inserted, use newItemHandler to handle the new item case
  onItemInsert?: (item: string) => any
  renderElement: RenderFunction<ComboboxItemProps>
}

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
