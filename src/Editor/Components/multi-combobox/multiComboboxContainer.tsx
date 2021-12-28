import React from 'react'
import { Combobox } from '../combobox/components/Combobox'
import { ComboboxItemProps, RenderFunction } from '../combobox/components/Combobox.types'
import { useComboboxControls } from '../combobox/hooks/useComboboxControls'
import { useCreatableOnSelect } from '../combobox/hooks/useComboboxOnKeyDown'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from '../SlashCommands/Types'
import { useElementOnChange, useOnSelectItem } from './useMultiComboboxOnKeyDown'

export interface ComboConfigData {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
}

export interface ConfigDataKeys {
  [type: string]: SingleComboboxConfig
}

export interface ConfigDataSlashCommands {
  [type: string]: SlashCommandConfig
}

export interface SingleComboboxConfig {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  renderElement: RenderFunction<ComboboxItemProps>
}

export const ElementComboboxComponent = () => {
  const config = useComboboxStore((store) => store.comboConfig)
  const { keys, slashCommands } = config
  const comboboxKey: string = useComboboxStore.getState().key
  const comboRenderType = keys[comboboxKey]
  const { elementChangeHandler: onSelectItem, isSlash } = useOnSelectItem(comboboxKey, slashCommands, comboRenderType)
  const onNewItem = (newItem, parentId?) => {
    comboRenderType.newItemHandler(newItem, parentId)
  }

  const creatableOnSelectItem = useCreatableOnSelect(onSelectItem, onNewItem)

  return (
    <Combobox
      isSlash={isSlash}
      onSelectItem={isSlash ? (onSelectItem as any) : creatableOnSelectItem}
      onRenderItem={comboRenderType.renderElement}
    />
  )
}

// Handle multiple combobox
export const MultiComboboxContainer = () => {
  useComboboxControls(true)

  return <ElementComboboxComponent />
}
