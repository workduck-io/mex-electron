import editIcon from '@iconify/icons-bx/bx-edit-alt'
import timeIcon from '@iconify/icons-bx/bx-time-five'
import { Icon } from '@iconify/react'
import { useUserService } from '@services/auth/useUserService'
import { transparentize } from 'polished'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useLinks } from '../../../hooks/useLinks'
import { useContentStore } from '../../../store/useContentStore'
import { ILink } from '../../../types/Types'
import { getRelativeTime } from '../../../utils/time'

export const Container = styled.section`
  position: absolute;
  top: 4.5rem;
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

const NodePreview = ({ node }: { node: ILink }) => {
  const getContent = useContentStore((store) => store.getContent)
  const { getNodeidFromPath } = useLinks()
  const nodeid = getNodeidFromPath(node?.path, node?.namespace)
  const content = getContent(nodeid)

  const { getUserDetailsUserId } = useUserService()
  const [alias, setAlias] = useState<string | undefined>()

  useEffect(() => {
    (async () => {
      if (content?.metadata?.lastEditedBy) {
        const user = await getUserDetailsUserId(content?.metadata?.lastEditedBy)
        if (user.alias) setAlias(user.alias)
      }
    })()
  }, [nodeid])

  const time = content?.metadata?.updatedAt

  return (
    <Container>
      <Header>{node?.path}</Header>
      <MetaDeta>
        {content?.metadata?.lastEditedBy && (
          <Flex>
            <StyledIcon icon={editIcon} />
            <SmallText>{alias}</SmallText>
          </Flex>
        )}
        {time && (
          <Flex>
            <StyledIcon icon={timeIcon} />
            <SmallText>{getRelativeTime(new Date(time))}</SmallText>
          </Flex>
        )}
      </MetaDeta>
      <Content>
        {content && <EditorPreviewRenderer content={content && content?.content} editorId={`__preview__${nodeid}_1`} />}
      </Content>
    </Container>
  )
}

export default NodePreview
