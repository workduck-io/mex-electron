import { RootClassName, RootStyles, StyledElementProps, Value } from '@udecode/plate'
import { IStyle } from '@uifabric/styling'
import { ILinkNode } from '../types'

export interface ILinkElementStyleProps extends RootClassName {
  selected?: boolean
  focused?: boolean
}

export interface ILinkElementStyleSet extends RootStyles {
  link?: IStyle
}

//@ts-ignore
export type ILinkElementProps = StyledElementProps<Value, ILinkNode, ILinkElementStyleSet>
