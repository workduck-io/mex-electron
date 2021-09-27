import { StyledElementProps } from '@udecode/plate-styled-components'
import { CSSProp } from 'styled-components'

export const ELEMENT_SYNC_BLOCK = 'sync_block'

export const connection_services = ['telegram', 'slack', 'notion', 'github', 'mex']

export type connections = 'telegram' | 'slack' | 'notion' | 'github' | 'mex'

export interface SyncBlockData {
  id: string
  content: string
  connections: connections[]
}

export interface SyncElementData {
  id: string
}

export interface SyncBlockTemplate {
  id: string
  intents: Intent[]
}

export interface SyncBlockStyles {
  iframeWrapper: CSSProp
  iframe: CSSProp
  input: CSSProp
}

export interface Intent {
  service: string
  type: string // channel/repo etc
  value: string // ID of the intent
}

export type SyncBlockProps = StyledElementProps<SyncElementData, SyncBlockStyles>

export type SyncContextType = {
  syncId: string
  syncBlocks: SyncBlockData[]
  syncBlockTemplates: SyncBlockData[]
  intents: {
    [id: string]: {
      intents: Intent[]
      intentGroups: { [templateId: string]: Intent[] }
    } // ID of the node is mapped with intents
  }
  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void
  initSyncBlocks: (syncBlocks: SyncBlockData[]) => void
  editSyncBlock: (block: SyncBlockData) => void
}
