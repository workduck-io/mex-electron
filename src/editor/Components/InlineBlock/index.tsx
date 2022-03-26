import React, { useMemo } from 'react'
import { useSelected } from 'slate-react'
import styled from 'styled-components'
import useArchive from '../../../hooks/useArchive'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useContentStore } from '../../../store/useContentStore'
import { mog } from '../../../utils/lib/helper'
import { getBlock } from '../../../utils/search/parseData'
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
  const { getPathFromNodeid } = useLinks()
  const getContent = useContentStore((store) => store.getContent)
  const path = useMemo(() => getPathFromNodeid(props.element.value), [props.element.value])
  const nodeid = props.element.value
  const blockId = props.element.blockId

  const content = useMemo(() => {
    if (blockId) {
      const data = getBlock(nodeid, blockId)
      return data ? [data] : undefined
    }
    const data = getContent(nodeid)?.content

    return data
  }, [nodeid, blockId])

  const { onSave } = useSaver()
  const { archived } = useArchive()

  const openNode = (ev: any) => {
    ev.preventDefault()
    onSave()
    push(nodeid)
  }

  const selected = useSelected()

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            <InlineFlex>
              <InlineBlockHeading>{blockId ? 'Within:' : 'From:'}</InlineBlockHeading>
              <InlineBlockText>{path}</InlineBlockText>
            </InlineFlex>
            {archived(nodeid) ? <StyledArchiveText>Archived</StyledArchiveText> : <Chip onClick={openNode}>Open</Chip>}
          </FlexBetween>
          {
            <StyledInlineBlockPreview>
              <EditorPreviewRenderer content={content} editorId={`__preview__${blockId ?? nodeid}`} />
            </StyledInlineBlockPreview>
          }
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
