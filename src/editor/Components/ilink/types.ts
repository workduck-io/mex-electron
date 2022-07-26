import { TElement } from '@udecode/plate-core'

// Element node
export interface ILinkNode extends TElement {
  value: string
  [key: string]: any
}
