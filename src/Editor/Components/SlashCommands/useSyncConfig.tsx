import { SlashCommandConfig } from './Types'
import { SEPARATOR } from '../../../Components/Sidebar/treeUtils'
import { getNewBlockId } from '../SyncBlock/getNewBlockData'
import { ELEMENT_SYNC_BLOCK } from '../SyncBlock'

const ServiceMap = {
  issue: { connections: ['github', 'slack'] },
  com: { connections: ['telegram', 'slack'] },
  slack: { connections: ['slack'] }
}

export const useSyncConfig = () => {
  const getSyncBlockConfigs = (): { [key: string]: SlashCommandConfig } => {
    return Object.keys(ServiceMap).reduce((prev, cur) => {
      return {
        ...prev,
        [cur]: {
          slateElementType: ELEMENT_SYNC_BLOCK,
          command: getSyncCommand(cur),
          getBlockData: () => ({
            id: getNewBlockId(),
            connections: ServiceMap[cur].connections,
            content: ''
          })
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
