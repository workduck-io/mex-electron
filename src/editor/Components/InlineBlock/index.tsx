import React from 'react'
import { useSelected } from 'slate-react'
import styled from 'styled-components'
import useArchive from '../../../hooks/useArchive'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useContentStore } from '../../../store/useContentStore'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import { useSaver } from '../Saver'
import { RootElement } from '../SyncBlock'
import {
  Chip,
  FlexBetween,
  InlineBlockHeading,
  InlineBlockText,
  InlineFlex,
  StyledInlineBlock,
  StyledInlineBlockPreview
} from './styled'

import { OnboardElements } from '../../../components/mex/Onboarding/types'

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { push } = useNavigation()
  const { getUidFromNodeId } = useLinks()
  const nodeid = getUidFromNodeId(props.element.value)
  const getContent = useContentStore((store) => store.getContent)
  const content = getContent(nodeid)
  const selected = useSelected()
  const { onSave } = useSaver()
  const { archived } = useArchive()

  const openNode = (ev: any) => {
    ev.preventDefault()
    onSave()
    push(nodeid)
  }

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour={OnboardElements.INLINE_BLOCK}>
          <FlexBetween>
            <InlineFlex>
              <InlineBlockHeading>From:</InlineBlockHeading>
              <InlineBlockText>{props.element.value}</InlineBlockText>
            </InlineFlex>
            {archived(nodeid) ? <StyledArchiveText>Archived</StyledArchiveText> : <Chip onClick={openNode}>Open</Chip>}
          </FlexBetween>
          {!archived(nodeid) && (
            <StyledInlineBlockPreview>
              {content && (
                <EditorPreviewRenderer content={content && content.content} editorId={`__preview__${nodeid}`} />
              )}
            </StyledInlineBlockPreview>
          )}
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
