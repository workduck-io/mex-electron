import React from 'react'
import { mog } from '../../../utils/lib/helper'
import { Combobox } from '../combobox/components/Combobox'
import { ComboboxItemProps, RenderFunction } from '../combobox/components/Combobox.types'
import { useComboboxControls } from '../combobox/hooks/useComboboxControls'
import { getCreateableOnSelect } from '../combobox/hooks/useComboboxOnKeyDown'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from '../SlashCommands/Types'
import { useOnSelectItem } from './useMultiComboboxOnKeyDown'

export interface ComboConfigData {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
  internal: {
    ilink: SingleComboboxConfig
    commands: ConfigDataSlashCommands
  }
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

export const ElementComboboxComponent = ({ keys, slashCommands, internal }: ComboConfigData) => {
  const comboboxKey: string = useComboboxStore.getState().key
  const comboRenderType = keys[comboboxKey]

  const { elementChangeHandler: onSelectItem, isSlash } = useOnSelectItem(
    comboboxKey,
    slashCommands,
    comboRenderType,
    internal.commands
  )
  // mog('ElementComboboxComponent ', { slashCommands, comboRenderType, comboboxKey, keys, internal })
  const onNewItem = (newItem, parentId?) => {
    return comboRenderType.newItemHandler(newItem, parentId)
  }

  const creatableOnSelectItem = getCreateableOnSelect(onSelectItem, onNewItem)

  return (
    <Combobox
      isSlash={isSlash}
      onSelectItem={isSlash ? (onSelectItem as any) : creatableOnSelectItem}
      onRenderItem={comboRenderType.renderElement}
    />
  )
}

// Handle multiple combobox
export const MultiComboboxContainer = ({ config }: { config: ComboConfigData }) => {
  useComboboxControls(true)

  return <ElementComboboxComponent {...config} />
}
