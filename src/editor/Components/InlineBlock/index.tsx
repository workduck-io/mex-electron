import { useNodes } from '@hooks/useNodes'
import { NodeType } from '../../../types/Types'
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
import { SharedNodeIcon } from '@components/icons/Icons'

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const getContent = useContentStore((store) => store.getContent)
  const path = useMemo(() => getPathFromNodeid(props.element.value, true), [props.element.value])
  const nodeid = props.element.value
  const blockId = props.element.blockId
  const nodeType = getNodeType(nodeid)

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

  mog('InlineBlock', { nodeid, selected, content, nodeType, path })

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            {nodeType !== NodeType.MISSING && (
              <InlineFlex>
                <InlineBlockHeading>{blockId ? 'Within:' : 'From:'}</InlineBlockHeading>
                {nodeType === NodeType.SHARED && <SharedNodeIcon />}
                <InlineBlockText>{path}</InlineBlockText>
              </InlineFlex>
            )}
            {
              {
                [NodeType.ARCHIVED]: <StyledArchiveText>Archived</StyledArchiveText>,
                [NodeType.MISSING]: <StyledArchiveText>Private/Missing</StyledArchiveText>,
                [NodeType.SHARED]: <Chip onClick={openNode}>Open</Chip>,
                [NodeType.DEFAULT]: <Chip onClick={openNode}>Open</Chip>
              }[nodeType]
            }
          </FlexBetween>
          {(nodeType === NodeType.SHARED || nodeType === NodeType.DEFAULT) && (
            <StyledInlineBlockPreview>
              <EditorPreviewRenderer content={content} editorId={`__preview__${blockId ?? nodeid}`} />
            </StyledInlineBlockPreview>
          )}
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
