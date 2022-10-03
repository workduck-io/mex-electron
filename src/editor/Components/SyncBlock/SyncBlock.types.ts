import type { TElement, Value } from '@udecode/plate'
import type { StyledElementProps } from '@udecode/plate-styled-components'
import type { CSSProp } from 'styled-components'

import type { BlockIdType } from '../Blocks/types'

export const ELEMENT_SYNC_BLOCK = 'sync_block'

export const connection_services = ['telegram', 'slack', 'notion', 'github', 'mex']

export type connections = 'telegram' | 'slack' | 'notion' | 'github' | 'mex'

export interface SyncBlockData {
  id: string
  content: string
  igid: string | undefined
  templateId: string
}

export interface SyncElementData extends BlockIdType, TElement {
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
  enabled: boolean // * From backend
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

export type SyncBlockProps = StyledElementProps<Value, SyncElementData, SyncBlockStyles> & { info?: boolean }

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
  selectedSyncBlock?: string

  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void
  addTemplate: (template: SyncBlockTemplate) => void
  deleteTemplate: (templateId: string) => void
  connectService: (id: string) => void
  setServices: (services: Service[]) => void
  setSelected: (id: string) => void
  initSyncBlocks: (
    syncBlocks: SyncBlockData[],
    templates: SyncBlockTemplate[],
    services: Service[],
    intents: SyncStoreIntents
  ) => void
  setTemplates: (templates: SyncBlockTemplate[]) => void
  editSyncBlock: (block: SyncBlockData) => void
  addIgid: (nodeid: string, igid: string, intents: Intent[], templateId: string) => void
  addIntentEmptyMap: (nodeid: string) => void
  updateIntentsAndIGIDs: (nodeid: string, nodeIntentConfig: NodeIntentConfig) => void
}
