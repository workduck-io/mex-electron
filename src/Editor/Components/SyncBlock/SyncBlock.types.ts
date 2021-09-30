import { StyledElementProps } from '@udecode/plate-styled-components'
import { CSSProp } from 'styled-components'

export const ELEMENT_SYNC_BLOCK = 'sync_block'

export const connection_services = ['telegram', 'slack', 'notion', 'github', 'mex']

export type connections = 'telegram' | 'slack' | 'notion' | 'github' | 'mex'

export interface SyncBlockData {
  id: string
  content: string
  igid: string | undefined
}

export interface SyncElementData {
  id: string
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

export interface IntentTemplate {
  service: string
  type: string // channel/repo etc
}

export interface Intent extends IntentTemplate {
  name: string
  value: string // ID of the intent
}

export interface IntentGroup {
  templateId: string
  intents: Intent[]
}

type TemplateID = string

export type SyncBlockProps = StyledElementProps<SyncElementData, SyncBlockStyles>

export interface SyncStoreIntents {
  [id: string]: {
    intents: Intent[]
    intentGroups: {
      [IntentGroupID: string]: IntentGroup
    }
  } // ID of the node is mapped with intents
}

export type SyncContextType = {
  syncId: string
  syncBlocks: SyncBlockData[]
  templates: SyncBlockTemplate[]
  intents: SyncStoreIntents
  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void
  addTemplate: (template: SyncBlockTemplate) => void
  initSyncBlocks: (syncBlocks: SyncBlockData[], templates: SyncBlockTemplate[]) => void
  editSyncBlock: (block: SyncBlockData) => void
  addIgid: (id: string, igid: string, intents: Intent[], templateId: string) => void
}
