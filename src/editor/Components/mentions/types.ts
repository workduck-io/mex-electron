import { TMentionElement } from '@udecode/plate'

// Data of Element node
export interface MentionNode extends TMentionElement {
  value: string
  [key: string]: any
}
