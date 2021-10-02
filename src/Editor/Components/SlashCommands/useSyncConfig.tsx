import { clone, findKey } from 'lodash'
import { nanoid } from 'nanoid'
import { SEPARATOR } from '../../../Components/Sidebar/treeUtils'
import { DefaultSyncBlockTemplates } from '../../../Defaults/syncTemplates'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useSyncStore } from '../../../Editor/Store/SyncStore'
import useIntents from '../../../Hooks/useIntents/useIntents'
import { ELEMENT_SYNC_BLOCK } from '../SyncBlock'
import { SlashCommandConfig } from './Types'

export const useSyncConfig = () => {
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)
  const { checkAndGenerateIGID } = useIntents()

  // Construct the SyncBlock configs for syncBlock templates
  const getSyncBlockConfigs = (): {
    [key: string]: SlashCommandConfig
  } => {
    return Object.keys(DefaultSyncBlockTemplates).reduce((prev, cur) => {
      // Current Template
      const curTemplate = DefaultSyncBlockTemplates[cur]
      const editorNodeId = useEditorStore.getState().node.id
      const id = nanoid()
      return {
        ...prev,
        [cur]: {
          slateElementType: ELEMENT_SYNC_BLOCK,
          command: getSyncCommand(cur),
          getBlockData: () => {
            const igid = checkAndGenerateIGID(editorNodeId, cur)
            const nd = {
              id,
              igid,
              content: '',
              templateId: cur
            }
            // creation of IGID if none found. Don't create until services are linked
            addSyncBlock(nd)
            return { id }
          }
        }
      }
    }, {})
  }

  return { getSyncBlockConfigs }
}

export const getSyncCommand = (title: string) => `sync${SEPARATOR}${title}`

export const extractSyncBlockCommands = (): string[] => {
  return Object.keys(DefaultSyncBlockTemplates).map((c) => getSyncCommand(c))
}

export const getSyncServicesKey = (connections: string[]) =>
  findKey(DefaultSyncBlockTemplates, (k) => {
    return clone(k.intentTemplates).sort().toString() === clone(connections).sort().toString()
  })

export const getParentSyncBlock = (connections: string[]) => `BLOCK_${getSyncServicesKey(connections)}`

export const getSyncBlockTitle = (connections: string[]): string | undefined => {
  const key = getSyncServicesKey(connections)

  if (key) return DefaultSyncBlockTemplates[key].title
  return undefined
}
