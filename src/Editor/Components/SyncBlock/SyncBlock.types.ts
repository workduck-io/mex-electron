import { StyledElementProps } from '@udecode/plate-styled-components'
import { CSSProp } from 'styled-components'

export const ELEMENT_SYNC_BLOCK = 'sync_block'

export const connection_services = ['telegram', 'slack', 'notion', 'github', 'mex']

export type connections = 'telegram' | 'slack' | 'notion' | 'github' | 'mex'

export interface SyncBlockData {
  id: string
  content: string
  intentGroupId: string
}

export interface SyncElementData {
  id: string
}

export interface SyncBlockTemplate {
  id: string
  title: string
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
  value: string // ID of the intent
}

type TemplateID = string

export type SyncBlockProps = StyledElementProps<SyncElementData, SyncBlockStyles>

/**

templateID

 */
export type SyncContextType = {
  syncId: string
  syncBlocks: SyncBlockData[]
  templates: SyncBlockTemplate[]
  intents: {
    [id: string]: {
      intents: Intent[]
      intentGroups: {
        [IntentGroupID: string]: TemplateID
      }
    } // ID of the node is mapped with intents
  }
  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void
  addTemplate: (template: SyncBlockTemplate) => void
  initSyncBlocks: (syncBlocks: SyncBlockData[], templates: SyncBlockTemplate[]) => void
  editSyncBlock: (block: SyncBlockData) => void
}
