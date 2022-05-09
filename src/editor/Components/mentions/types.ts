import { TElement } from '@udecode/plate-core'

// Data of Element node
export interface MentionNodeData {
  value: string
  [key: string]: any
}

// Element node
export type MentionNode = TElement<MentionNodeData>
