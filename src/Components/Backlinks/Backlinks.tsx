import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { useLinks } from '../../Editor/Actions/useLinks'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Note } from '../../Styled/Typography'

const BackLinkWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[9]};
  }
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
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const backlinks = getBacklinks(useEditorStore.getState().node.id)

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
          <BackLink key={`backlink_${l.from}`} onClick={() => loadNodeFromId(l.from)}>
            {l.from}
          </BackLink>
        ))}
      </SBackLinks>
    </BackLinkWrapper>
  )
}

export default Backlinks
