import { TElement } from '@udecode/plate-core';

// Data of Element node
export interface ILinkNodeData {
  value: string;
  [key: string]: any;
}

// Element node
export type ILinkNode = TElement<ILinkNodeData>;
