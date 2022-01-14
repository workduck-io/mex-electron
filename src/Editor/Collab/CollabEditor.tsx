import { Plate , withPlate } from '@udecode/plate'
import React, { useMemo, useState } from 'react'
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
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MultiComboboxContainer } from '../Components/multi-combobox/multiComboboxContainer'


const WEBSOCKET_ENDPOINT = !IS_DEV ? 'wss://collab.workduck.io/mex' : 'ws://localhost:1234'

type CollabEditorProps = {
  nodeId: string
}

const CollabEditor: React.FC<CollabEditorProps> = ({ nodeId }) => {
  const [editorContent, setEditorContent] = useState<NodeEditorContent>([{ children: [{ text: '' }] }])


  // * Editor Plugins
  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(nodeId)

  // * We get memoized plugins
  const prePlugins = generatePlugins()
  const plugins = [
    ...prePlugins,
    // createCollabPlugin,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]


  // * Collab hook
  const { editor, connected, toggleConnection } = useCollabMode({
    plateEditor: {
      id: nodeId,
      plugins
    },
    onlineMode: {
      documentID: 'SOME_NODE_ID',
      userName: 'mex',
      color: '#333',
      webSocketEndpoint: WEBSOCKET_ENDPOINT
    }
  })


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
          <DndProvider backend={HTML5Backend}>
            <Plate
              value={editorContent}
              onChange={(content) => setEditorContent(content)}
              editor={editor}
              id={nodeId}
              plugins={plugins}
            >
              <MultiComboboxContainer keys={comboConfigData.keys} slashCommands={comboConfigData.slashCommands} />
            </Plate>
          </DndProvider>
        </FullEditor>
      </EditorStyles>
    </Margin>
  )
}

export default CollabEditor
