import React, { useMemo } from 'react'

import { SharedNodeIcon } from '@components/icons/Icons'
import { useNodes } from '@hooks/useNodes'
import { useNoteContext } from '@store/Context/context.note'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { openNodeInMex } from '@utils/combineSources'
import { useSelected } from 'slate-react'
import styled from 'styled-components'

import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useContentStore } from '../../../store/useContentStore'
import { NodeType } from '../../../types/Types'
import { mog } from '../../../utils/lib/helper'
import { getBlock } from '../../../utils/search/parseData'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
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
import { ROUTE_PATHS, useRouting, NavigationType } from '@views/routes/urls'
import { useNamespaces } from '@hooks/useNamespaces'
import { useMatch } from 'react-router-dom'
import NamespaceTag from '@components/mex/NamespaceTag'

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { push } = useNavigation()
  const { goTo } = useRouting()
  const { getPathFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const { getNamespaceOfNode, getNamespaceIconForNode } = useNamespaces()
  const getContent = useContentStore((store) => store.getContent)
  const path = useMemo(() => getPathFromNodeid(props.element.value, true), [props.element.value])
  const nodeid = props.element.value
  const blockId = props.element.blockId
  const nodeType = getNodeType(nodeid)
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)

  const spotlightCtx = useSpotlightContext()
  const noteCtx = useNoteContext()

  const content = useMemo(() => {
    if (blockId) {
      const data = getBlock(nodeid, blockId)
      return data ? [data] : undefined
    }

    const data = getContent(nodeid)?.content

    return data
  }, [nodeid, blockId])

  const openLinkNode = (noteId: string) => {
    push(noteId)
    goTo(ROUTE_PATHS.node, NavigationType.push, noteId)
  }

  const openNode = (ev: any) => {
    ev.preventDefault()
    if (noteCtx || spotlightCtx) openNodeInMex(nodeid)
    else {
      openLinkNode(nodeid)
    }
  }

  const selected = useSelected()

  const currentMainNode = match?.params?.nodeid
  const namespace = getNamespaceOfNode(props.element?.value)
  const currentNodeNamespace = getNamespaceOfNode(currentMainNode)
  const showNamespace = namespace?.id !== currentNodeNamespace?.id

  mog('InlineBlock', { nodeid, selected, content, nodeType, path })

  return (
    <RootElement {...props.attributes}>
      <StyledInlineBlock contentEditable={false} selected={selected} data-tour="mex-onboarding-inline-block">
        <FlexBetween>
          {nodeType !== NodeType.MISSING && (
            <InlineFlex>
              <InlineBlockHeading>{blockId ? 'Within:' : 'From:'}</InlineBlockHeading>
              {nodeType === NodeType.SHARED && <SharedNodeIcon />}
              <InlineBlockText>{path}</InlineBlockText>
              {showNamespace && <NamespaceTag separator namespace={namespace} />}
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
            <EditorPreviewRenderer content={content} editorId={`${nodeid}_${blockId}_Inline_Block`} />
          </StyledInlineBlockPreview>
        )}
      </StyledInlineBlock>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
