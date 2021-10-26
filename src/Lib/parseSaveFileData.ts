import { FileData, NodeFileData, SettingsFileData, SpotlightSettingsFileData } from '../Types/data'

/*
ilinks: ILink[]
  tags: ComboText[]
  contents: {
    [key: string]: NodeContent
  }
  linkCache: LinkCache

  // Sync
  syncBlocks: SyncBlockData[]
  templates: SyncBlockTemplate[]
  intents: SyncStoreIntents
  services: Service[]
*/
export const splitSaveData = (data: FileData) => {
  const {
    remoteUpdate,
    ilinks,
    tags,
    contents,
    linkCache,
    syncBlocks,
    templates,
    intents,
    services,
    snippets,
    userSettings,
    spotlightSettings
  } = data

  const NodeData: NodeFileData = {
    remoteUpdate,
    ilinks,
    tags,
    contents,
    linkCache,
    syncBlocks,
    templates,
    intents,
    services,
    snippets
  }

  const SettingsData: SettingsFileData = userSettings
  const SpotlightSettingsData: SpotlightSettingsFileData = spotlightSettings

  return { NodeData, SettingsData, SpotlightSettingsData }
}
