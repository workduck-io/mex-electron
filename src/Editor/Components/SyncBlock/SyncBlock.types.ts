import { StyledElementProps } from '@udecode/plate-styled-components'
import { CSSProp } from 'styled-components'

export const ELEMENT_SYNC_BLOCK = 'sync_block'

export const connection_services = ['telegram', 'slack', 'notion', 'github', 'mex']

export type connections = 'telegram' | 'slack' | 'notion' | 'github' | 'mex'

export interface SyncBlockData {
  id: string
  content: string
  igid: string | undefined
  templateId: string
}

export interface SyncElementData {
  id: string
  properties?: {
    content: string
    igid: string
    templateId: string
    service: string
  }
}

export interface SyncBlockTemplate {
  id: TemplateID
  title: string
  command: string
  description: string
  intents: IntentTemplate[]
}

export interface SyncBlockStyles {
  iframeWrapper: CSSProp
  iframe: CSSProp
  input: CSSProp
}

export interface Service {
  id: string
  name: string
  type: string
  imageUrl: string
  description: string
  authUrl: string
  // Is the service connected
  connected: boolean
}

export interface IntentTemplate {
  service: string
  type: string // channel/repo etc
}

export interface Intent extends IntentTemplate {
  name: string
  value: string // ID of the intent
  options?: any
}

export interface IntentGroup {
  templateId: string
  intents: Intent[]
}

type TemplateID = string

export type SyncBlockProps = StyledElementProps<SyncElementData, SyncBlockStyles>

export interface NodeIntentConfig {
  intents: Intent[]
  intentGroups: {
    [IntentGroupID: string]: IntentGroup
  }
}

export interface SyncStoreIntents {
  [id: string]: NodeIntentConfig
  // ID of the node is mapped with intents
}

export type SyncContextType = {
  syncBlocks: SyncBlockData[]
  templates: SyncBlockTemplate[]
  services: Service[]
  intents: SyncStoreIntents
  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void
  addTemplate: (template: SyncBlockTemplate) => void
  connectService: (id: string) => void
  setServices: (services: Service[]) => void
  initSyncBlocks: (
    syncBlocks: SyncBlockData[],
    templates: SyncBlockTemplate[],
    services: Service[],
    intents: SyncStoreIntents
  ) => void
  editSyncBlock: (block: SyncBlockData) => void
  addIgid: (uid: string, igid: string, intents: Intent[], templateId: string) => void
  addIntentEmptyMap: (uid: string) => void
  updateIntentsAndIGIDs: (uid: string, nodeIntentConfig: NodeIntentConfig) => void
}
