import { SlashCommandConfig } from './Types'
import { SEPARATOR } from '../../../Components/Sidebar/treeUtils'
import { getNewBlockId } from '../SyncBlock/getNewBlockData'
import { ELEMENT_SYNC_BLOCK } from '../SyncBlock'
import { useSyncStore } from '../../../Editor/Store/SyncStore'
import { findKey } from 'lodash'

const ServiceMap = {
  issue: { title: 'Issue', connections: ['github', 'slack'] },
  com: { title: 'Communication', connections: ['telegram', 'slack'] },
  slack: { title: 'Slack', connections: ['slack'] }
}

export const useSyncConfig = () => {
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)
  const getSyncBlockConfigs = (): { [key: string]: SlashCommandConfig } => {
    return Object.keys(ServiceMap).reduce((prev, cur) => {
      return {
        ...prev,
        [cur]: {
          slateElementType: ELEMENT_SYNC_BLOCK,
          command: getSyncCommand(cur),
          getBlockData: () => {
            const nd = {
              id: getNewBlockId(),
              connections: ServiceMap[cur].connections,
              content: ''
            }
            addSyncBlock(nd)
            return nd
          }
        }
      }
    }, {})
  }

  return { getSyncBlockConfigs }
}

export const getSyncCommand = (title: string) => `sync${SEPARATOR}${title}`

export const extractSyncBlockCommands = (): string[] => {
  return Object.keys(ServiceMap).map((c) => getSyncCommand(c))
}

export const getSyncServicesKey = (connections: string[]) => findKey(ServiceMap, { connections })

export const getParentSyncBlock = (connections: string[]) => `BLOCK_${getSyncServicesKey(connections)}`

export const getSyncBlockTitle = (connections: string[]): string | undefined => {
  const key = getSyncServicesKey(connections)
  if (key) return ServiceMap[key].title
  return undefined
}
