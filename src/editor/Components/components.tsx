/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createPlateUI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  withProps
} from '@udecode/plate'
import { ILinkElement } from './ilink/components/ILinkElement'
import { ELEMENT_ILINK } from './ilink/defaults'
import InlineBlock from './InlineBlock'
import { ELEMENT_INLINE_BLOCK } from './InlineBlock/types'
import LinkElement from './Link'
import { MediaEmbedElement } from './media-embed-ui/src'
import { TagElement } from './tag/components/TagElement'
import { ELEMENT_TAG } from './tag/defaults'
import { StyledElement } from '@udecode/plate-styled-components'
import TableWrapper from './TableWrapper'
import Todo from './Todo'
import { ELEMENT_QA_BLOCK } from './QABlock/createQAPlugin'
import QABlock from './QABlock'
import { ELEMENT_ACTION_BLOCK } from './Actions/types'
import ActionBlock from './Actions'
import { ELEMENT_MENTION } from './mentions/defaults'
import { MentionElement } from './mentions/components/MentionElement'

export const editorPreviewComponents = createPlateUI({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a'
  }),
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    styles: {
      root: {
        margin: '0.1rem 0 0'
      }
    }
  }),
  [ELEMENT_TODO_LI]: Todo as any,
  [ELEMENT_TAG]: TagElement as any,
  [ELEMENT_MENTION]: MentionElement as any,
  [ELEMENT_ILINK]: ILinkElement as any,
  [ELEMENT_INLINE_BLOCK]: ILinkElement as any,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
  [ELEMENT_QA_BLOCK]: QABlock as any,
  [ELEMENT_ACTION_BLOCK]: ActionBlock,
  [ELEMENT_TABLE]: TableWrapper
})

const components = createPlateUI({
  ...editorPreviewComponents,
  [ELEMENT_INLINE_BLOCK]: InlineBlock as any
})

export default components
