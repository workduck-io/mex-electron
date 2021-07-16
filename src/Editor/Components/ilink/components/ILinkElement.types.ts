import {
  ClassName,
  RootStyleSet,
  StyledElementProps,
} from '@udecode/slate-plugins';
import { IStyle } from '@uifabric/styling';
import { ILinkNode } from '../types';

export interface ILinkElementStyleProps extends ClassName {
  selected?: boolean;
  focused?: boolean;
}

export interface ILinkElementStyleSet extends RootStyleSet {
  link?: IStyle;
}

export type ILinkElementProps = StyledElementProps<
  ILinkNode,
  ILinkElementStyleProps,
  ILinkElementStyleSet
>;
