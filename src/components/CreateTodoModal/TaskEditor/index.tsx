import React, { useMemo } from 'react'

import { Plate } from '@udecode/plate'
import { debounce } from 'lodash'

import { getTodoPlugins } from './plugins'
import { useEditorChange } from '@hooks/useEditorActions'
import { NodeEditorContent } from '../../../types/Types'
import { MultiComboboxContainer } from '@editor/Components/multi-combobox/multiComboboxContainer'
import useMultiComboboxOnChange from '@editor/Components/multi-combobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '@editor/Components/multi-combobox/useMultiComboboxOnKeyDown'
import useEditorPluginConfig from '@editor/Plugins/useEditorPluginConfig'

type TaskEditorType = {
  editorId: string
  content: NodeEditorContent
  readOnly?: boolean
  onChange?: (val: any) => void
}

const TaskEditor = ({ editorId, readOnly, content, onChange }: TaskEditorType) => {
  // const config = useEditorPluginConfig(editorId)

  const plugins = useMemo(() => getTodoPlugins(), [])

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)

  const pluginsWithCombobox = [
    ...plugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEditorChange(editorId, content)

  const onDelayPerform = debounce(typeof onChange === 'function' ? onChange : () => undefined, 300)

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)
  }

  const editableProps = { placeholder: 'Add description...', readOnly, autoFocus: true }

  return (
    <Plate
      id={editorId}
      initialValue={content}
      plugins={pluginsWithCombobox}
      onChange={onChangeContent}
      editableProps={editableProps}
    >
      <MultiComboboxContainer config={comboConfigData} />
    </Plate>
  )
}

export default TaskEditor