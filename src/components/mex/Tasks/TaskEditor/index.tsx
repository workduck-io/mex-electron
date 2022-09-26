import BallonMarkToolbarButtons from '@editor/Components/EditorBalloonToolbar'
import useEditorPluginConfig from '@editor/Plugins/useEditorPluginConfig'
import { Plate } from '@udecode/plate'
import React, { useMemo } from 'react'
import { useContextMenu } from 'react-contexify'
import { getTodoPlugins } from './plugins'
import { MultiComboboxContainer } from '@editor/Components/multi-combobox/multiComboboxContainer'
import { MENU_ID } from '@editor/Components/EditorContextMenu'
import { NodeEditorContent } from '../../../../types/Types'
import { debounce } from 'lodash'

type TaskEditorType = {
  editorId: string
  content: NodeEditorContent
  readOnly?: boolean 
  onChange?: (val: any) => void
}

const TaskEditor = ({ editorId, readOnly, content, onChange }: TaskEditorType) => {
  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)
  const { show } = useContextMenu({ id: MENU_ID })

  const pluginsWithCombobox = useMemo(() => [
    ...getTodoPlugins(),
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
  ], [readOnly])

  // useEditorChange(editorId, content, onChange)

  const onDelayPerform = debounce(typeof onChange === 'function' ? onChange : () => undefined, 300)

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)
  }

  const editableProps = useMemo(() => ({ placeholder: 'Add description...', readOnly, spellCheck: true, autoFocus: true}) , [readOnly])

  return (
        <Plate
        id={editorId}
        initialValue={content}
        plugins={pluginsWithCombobox}
        onChange={onChangeContent}
        editableProps={editableProps}
      >
        <BallonMarkToolbarButtons />
        <MultiComboboxContainer config={comboConfigData} />
      </Plate>
  )
}

export default TaskEditor
