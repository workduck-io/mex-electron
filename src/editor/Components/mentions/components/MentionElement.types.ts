//@ts-nocheck
import { ClassName, RootStyled, StyledElementProps } from '@udecode/plate'
import { IStyle } from '@uifabric/styling'
import { MentionNode } from '../types'

export interface MentionElementStyleProps extends ClassName {
  selected?: boolean
  focused?: boolean
}

export interface MentionElementStyleSet extends RootStyled {
  link?: IStyle
}
export type MentionElementProps = StyledElementProps<MentionNode, MentionElementStyleProps, MentionElementStyleSet>
