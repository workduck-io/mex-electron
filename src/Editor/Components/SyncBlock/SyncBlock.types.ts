import { StyledElementProps } from '@udecode/plate-styled-components';
import { CSSProp } from 'styled-components';

export interface SyncBlockStyles {
  iframeWrapper: CSSProp;
  iframe: CSSProp;
  input: CSSProp;
}

export interface SyncBlockData {
  id: string;
  services: string[];
}

export type SyncBlockProps = StyledElementProps<SyncBlockData, SyncBlockStyles>;
