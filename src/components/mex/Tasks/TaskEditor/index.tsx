import BallonMarkToolbarButtons from '@editor/Components/EditorBalloonToolbar'
import useEditorPluginConfig from '@editor/Plugins/useEditorPluginConfig'
import { Plate } from '@udecode/plate'
import React from 'react'
import { useContextMenu } from 'react-contexify'
import { getTodoPlugins } from './plugins'
import { MultiComboboxContainer } from '@editor/Components/multi-combobox/multiComboboxContainer'
import { MENU_ID } from '@editor/Components/EditorContextMenu'
import { NodeEditorContent } from '../../../../types/Types'
import { useEditorChange } from '@hooks/useEditorActions'
import { debounce } from 'lodash'
import { TaskEditorStyle } from './styled'

type TaskEditorType = {
  editorId: string
  content: NodeEditorContent
  onChange: (val: any) => void
}

const TaskEditor = ({ editorId, content, onChange }: TaskEditorType) => {
  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)
  const { show } = useContextMenu({ id: MENU_ID })
  const basicPlugins = getTodoPlugins()

  const pluginsWithCombobox = [
    ...basicPlugins,
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

  useEditorChange(editorId, content, onChange)

  const onDelayPerform = debounce(typeof onChange === 'function' ? onChange : () => undefined, 300)

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)
  }

  return (
    <TaskEditorStyle>
      <Plate
        id={editorId}
        initialValue={content}
        plugins={pluginsWithCombobox}
        onChange={onChangeContent}
        editableProps={{ placeholder: 'Add description...', spellCheck: true, autoFocus: true }}
      >
        <BallonMarkToolbarButtons />
        <MultiComboboxContainer config={comboConfigData} />
      </Plate>
    </TaskEditorStyle>
  )
}

export default TaskEditor
