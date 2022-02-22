import React, { useMemo } from 'react'
import { useSelected } from 'slate-react'
import styled from 'styled-components'
import { defaultContent } from '../../../data/Defaults/baseData'
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

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { push } = useNavigation()
  const { getUidFromNodeId } = useLinks()
  const getContent = useContentStore((store) => store.getContent)
  const nodeid = useMemo(() => getUidFromNodeId(props.element.value), [props.element.value])
  const content = useMemo(() => getContent(nodeid), [nodeid])
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
        <StyledInlineBlock data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            <InlineFlex>
              <InlineBlockHeading>From:</InlineBlockHeading>
              <InlineBlockText>{props.element.value}</InlineBlockText>
            </InlineFlex>
            {archived(nodeid) ? <StyledArchiveText>Archived</StyledArchiveText> : <Chip onClick={openNode}>Open</Chip>}
          </FlexBetween>
          {!archived(nodeid) && (
            <StyledInlineBlockPreview>
              <EditorPreviewRenderer
                content={content?.content ?? defaultContent.content}
                editorId={`__preview__${nodeid}`}
              />
            </StyledInlineBlockPreview>
          )}
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
