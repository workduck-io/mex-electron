import React, { useMemo } from 'react'

import { MENU_ID } from '@editor/Components/EditorContextMenu'
import { MultiComboboxContainer } from '@editor/Components/multi-combobox/multiComboboxContainer'
import useEditorPluginConfig from '@editor/Plugins/useEditorPluginConfig'
import { useEditorChange } from '@hooks/useEditorActions'
import { Plate } from '@udecode/plate'
import { debounce } from 'lodash'
import { useContextMenu } from 'react-contexify'

import { NodeEditorContent } from '../../../../types/Types'
import { getTodoPlugins } from './plugins'

type TaskEditorType = {
  editorId: string
  content: NodeEditorContent
  readOnly?: boolean
  onChange?: (val: any) => void
}

const TaskEditor = ({ editorId, readOnly, content, onChange }: TaskEditorType) => {
  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId, {
    comboboxOptions: { snippets: false, table: false }
  })

  const { show } = useContextMenu({ id: MENU_ID })
  const plugins = useMemo(() => getTodoPlugins(), [])

  const pluginsWithCombobox = [
    ...plugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          show(ev)
        },
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
