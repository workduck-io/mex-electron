import { generateComboTexts, generateILinks } from '../Editor/Store/sampleTags'
import { FileData, SettingsFileData, SpotlightSettingsFileData } from '../Types/data'

const links = generateILinks(['doc', 'dev', 'design', '@', 'Draft'])

export const defaultContent = [{ children: [{ text: '' }] }]

const contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.uid]: { type: 'init', content: [{ children: [{ text: '' }] }] }
  }
}, {})

export const DefaultNodeData: FileData = {
  remoteUpdate: true,
  ilinks: links,
  contents,
  linkCache: {},
  tags: generateComboTexts(['mex']),
  syncBlocks: [],
  templates: [],
  intents: {},
  services: [],
  userSettings: {
    theme: 'dev'
  },
  spotlightSettings: {
    showSource: true
  },
  snippets: []
}

export const DefaultSettingsData: SettingsFileData = {
  theme: 'dev'
}

export const DefaultSpotlightSettingsData: SpotlightSettingsFileData = {
  showSource: true
}
