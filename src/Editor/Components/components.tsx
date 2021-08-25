/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPlateComponents, ELEMENT_LINK, ELEMENT_MEDIA_EMBED, withProps } from '@udecode/plate'
import { ILinkElement } from './ilink/components/ILinkElement'
import { ELEMENT_ILINK } from './ilink/defaults'
import LinkElement from './Link'
import { MediaEmbedElement } from './media-embed-ui/src'
import { SyncBlock, ELEMENT_SYNC_BLOCK } from './SyncBlock'
import { TagElement } from './tag/components/TagElement'
import { ELEMENT_TAG } from './tag/defaults'

const components = createPlateComponents({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a',
  }),
  [ELEMENT_TAG]: TagElement as any,
  [ELEMENT_ILINK]: ILinkElement as any,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
  [ELEMENT_SYNC_BLOCK]: SyncBlock as any,
})

export default components
