import { RootClassName, RootStyles, StyledElementProps } from '@udecode/plate';
import { IStyle } from '@uifabric/styling';
import { ILinkNode } from '../types';

export interface ILinkElementStyleProps extends RootClassName {
  selected?: boolean;
  focused?: boolean;
}

export interface ILinkElementStyleSet extends RootStyles {
  link?: IStyle;
}
//@ts-ignore
export type ILinkElementProps = StyledElementProps<ILinkNode, ILinkElementStyleProps, ILinkElementStyleSet>;
