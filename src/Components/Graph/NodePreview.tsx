import React from 'react'
import styled from 'styled-components'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useLinks } from '../../Editor/Actions/useLinks'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { transparentize } from 'polished'
import editIcon from '@iconify-icons/bx/bx-edit-alt'
import timeIcon from '@iconify-icons/bx/bx-time-five'
import { Icon } from '@iconify/react'
import { useRelativeTime as getTime } from '../../Hooks/useRelativeTime'

const Container = styled.section`
  position: absolute;
  top: 7rem;
  right: 0;
  display: flex;
  z-index: 1000;
  height: 20rem;
  width: 14rem;
  flex-direction: column;
  margin: 0 ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => transparentize(0.25, theme.colors.background.card)};
`

const Header = styled.div`
  display: flex;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.small};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
`

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
  height: 16rem;
  overflow-y: auto;
  scrollbar-width: thin;
`

const MetaDeta = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.small};
  margin: 0 ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
`

const StyledIcon = styled(Icon)`
  margin-right: 0.4rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
`

const SmallText = styled.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.disabled};
`

const NodePreview = ({ node }) => {
  const { getUidFromNodeId } = useLinks()
  const uid = getUidFromNodeId(node.nodeId)
  const getContent = useContentStore((store) => store.getContent)
  const content = getContent(uid)

  const time = content.metadata.updatedAt ? getTime(content.metadata.updatedAt) : 'recently'

  return (
    <Container>
      <Header>{node.nodeId}</Header>
      <MetaDeta>
        {content.metadata.lastEditedBy && (
          <Flex>
            <StyledIcon icon={editIcon} />
            <SmallText>{content.metadata.lastEditedBy}</SmallText>
          </Flex>
        )}
        {time && (
          <Flex>
            <StyledIcon icon={timeIcon} />
            <SmallText>{time}</SmallText>
          </Flex>
        )}
      </MetaDeta>
      <Content>
        {content && <EditorPreviewRenderer content={content && content.content} editorId={`__preview__${uid}_1`} />}
      </Content>
    </Container>
  )
}

export default NodePreview
