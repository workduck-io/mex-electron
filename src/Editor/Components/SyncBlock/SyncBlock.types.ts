import { StyledElementProps } from '@udecode/plate-styled-components';
import { CSSProp } from 'styled-components';

export const ELEMENT_SYNC_BLOCK = 'sync_block';

export const connection_services = ['telegram', 'slack', 'notion'];

export type connections = 'telegram' | 'slack' | 'notion';

export interface SyncBlockData {
  id: string;
  content: string;
  connections: connections[];
}

export interface SyncElementData {
  id: string;
}

export interface SyncBlockStyles {
  iframeWrapper: CSSProp;
  iframe: CSSProp;
  input: CSSProp;
}

export type SyncBlockProps = StyledElementProps<SyncElementData, SyncBlockStyles>;

export type SyncContextType = {
  syncBlocks: SyncBlockData[];
  // Load a node and its contents in the editor
  addSyncBlock: (block: SyncBlockData) => void;
  initSyncBlocks: (syncBlocks: SyncBlockData[]) => void;
  editSyncBlock: (block: SyncBlockData) => void;
};
