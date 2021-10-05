import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { useLinks } from '../../Editor/Actions/useLinks'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { Note } from '../../Styled/Typography'

const BackLinkWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 300px;
`

const SBackLinks = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
`

const BackLink = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  &:nth-child(2n) {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`

const BackLinksHeader = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.subheading};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Backlinks = () => {
  const { getBacklinks } = useLinks()
  const { push } = useNavigation()
  const backlinks = getBacklinks(useEditorStore.getState().node.uid)
  const { getNodeIdFromUid } = useLinks()

  return (
    <BackLinkWrapper>
      <SBackLinks>
        <BackLinksHeader>
          <Icon icon={arrowGoBackLine}></Icon>
          Backlinks
        </BackLinksHeader>
        {backlinks.length === 0 && (
          <>
            <Note>No backlinks found.</Note>
            <Note>Link from other nodes to view them here.</Note>
          </>
        )}
        {backlinks.map((l) => (
          <BackLink key={`backlink_${l.uid}`} onClick={() => push(l.uid)}>
            {getNodeIdFromUid(l.uid)}
          </BackLink>
        ))}
      </SBackLinks>
    </BackLinkWrapper>
  )
}

export default Backlinks
