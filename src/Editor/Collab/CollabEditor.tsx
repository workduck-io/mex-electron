import { Plate } from '@udecode/plate'
import React, { useState } from 'react'
import { IS_DEV } from '../../Defaults/dev_'
import useEditorPluginConfig from '../Plugins/useEditorPluginConfig'
import useCollabMode from './useCollabMode'
import generatePlugins from '../Plugins/plugins'
import { EditorStyles } from '../../Styled/Editor'
import ToggleButton from '../../Spotlight/components/ToggleButton'
import { Margin, Services } from '../../Styled/Integration'
import { Heading } from '../../Spotlight/components/SearchResults/styled'
import { FullEditor } from '../../Spotlight/components/MexIt/styled'
import { MarginHorizontal } from '../../Spotlight/components/SpotlightSettings/styled'
import { NodeEditorContent } from '../Store/Types'

const WEBSOCKET_ENDPOINT = !IS_DEV ? 'wss://collab.workduck.io/mex' : 'ws://localhost:1234'

type CollabEditorProps = {
  nodeId: string
}

const CollabEditor: React.FC<CollabEditorProps> = ({ nodeId }) => {
  const [editorContent, setEditorContent] = useState<NodeEditorContent>([])

  // * Collab hook
  const { editor, connected, toggleConnection } = useCollabMode({
    onlineMode: {
      documentID: 'SOME_NODE_ID',
      userName: 'mex',
      color: '#333',
      webSocketEndpoint: WEBSOCKET_ENDPOINT
    }
  })

  // * Editor Plugins
  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(nodeId)

  // * We get memoized plugins
  const prePlugins = generatePlugins()
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  return (
    <Margin>
      <EditorStyles>
        <Services>
          <Heading>Toggle status: </Heading>
          <MarginHorizontal>
            <ToggleButton id={nodeId} value={connected} size="xs" onChange={toggleConnection} checked={connected} />
          </MarginHorizontal>
        </Services>

        <FullEditor>
          <Plate
            value={editorContent}
            editableProps={{ placeholder: 'Write something...' }}
            onChange={(content) => setEditorContent(content)}
            editor={editor}
            id={nodeId}
            plugins={plugins}
          />
        </FullEditor>
      </EditorStyles>
    </Margin>
  )
}

export default CollabEditor
