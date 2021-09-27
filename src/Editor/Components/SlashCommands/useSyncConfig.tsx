import { SlashCommandConfig } from './Types'
import { SEPARATOR } from '../../../Components/Sidebar/treeUtils'
import { getNewBlockId } from '../SyncBlock/getNewBlockData'
import { ELEMENT_SYNC_BLOCK, IntentTemplate } from '../SyncBlock'
import { useSyncStore } from '../../../Editor/Store/SyncStore'
import { findKey, clone } from 'lodash'
import { DefaultSyncBlockTemplates } from '../../../Defaults/syncTemplates'
import useIntents from '../../../Hooks/useIntents/useIntents'
import { useEditorStore } from '../../../Editor/Store/EditorStore'

export const useSyncConfig = () => {
  const addSyncBlockTemplate = useSyncStore((state) => state.addTemplate)
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)

  const { getIntents } = useIntents()

  // Construct the SyncBlock configs for syncBlock templates
  const getSyncBlockConfigs = (): {
    [key: string]: SlashCommandConfig
  } => {
    return Object.keys(DefaultSyncBlockTemplates).reduce((prev, cur) => {
      // Current Template
      const curTemplate = DefaultSyncBlockTemplates[cur]
      return {
        ...prev,
        [cur]: {
          slateElementType: ELEMENT_SYNC_BLOCK,
          command: getSyncCommand(cur),
          getBlockData: () => {
            const nd = {
              id: cur,
              intentGroupId: '',
              content: ''
            }
            // creation of IGID if none found. Don't create until services are linked
            addSyncBlock(nd)
            return { id: nd }
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
