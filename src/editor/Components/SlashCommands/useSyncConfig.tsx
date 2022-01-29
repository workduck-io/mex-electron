import { SEPARATOR } from '../../../components/mex/Sidebar/treeUtils'
import { generateSyncBlockId } from '../../../data/Defaults/idPrefixes'
import useIntents from '../../../hooks/useIntents'
import { useEditorStore } from '../../../store/useEditorStore'
import { useSyncStore } from '../../../store/useSyncStore'
import { ELEMENT_SYNC_BLOCK, SyncBlockTemplate } from '../SyncBlock'
import { SlashCommandConfig } from './Types'

export const useSyncConfig = () => {
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)
  const { checkAndGenerateIGID } = useIntents()
  const templates = useSyncStore((store) => store.templates)

  // Construct the SyncBlock configs for syncBlock templates
  const getSyncBlockConfigs = (): {
    [key: string]: SlashCommandConfig
  } => {
    const configs = templates.reduce((prev, cur) => {
      // Current Template
      const curUid = useEditorStore.getState().node.nodeid
      const command = getSyncCommand(cur.command)
      const config = {
        slateElementType: ELEMENT_SYNC_BLOCK,
        command,
        getBlockData: () => {
          const id = generateSyncBlockId()
          const igid = checkAndGenerateIGID(curUid, cur.id)
          const nd = {
            id,
            igid,
            content: '',
            templateId: cur.id
          }
          // creation of IGID if none found. Don't create until services are linked

          addSyncBlock(nd)
          return { id }
        }
      }

      return {
        ...prev,
        [command]: config
      }
    }, {})

    return configs
  }

  return { getSyncBlockConfigs }
}

export const FlowCommandPrefix = 'flow'
export const getSyncCommand = (title: string) => `${FlowCommandPrefix}${SEPARATOR}${title}`

export const extractSyncBlockCommands = (templates: SyncBlockTemplate[]): string[] => {
  return templates.filter((temp) => temp.command !== undefined).map((c) => getSyncCommand(c.command))
}
