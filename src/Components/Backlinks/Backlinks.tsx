import React from 'react'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useLinks } from '../../Editor/Actions/useLinks'
import styled from 'styled-components'
import { transparentize } from 'polished'

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
const Backlinks = () => {
  const { getBacklinks } = useLinks()
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)

  return (
    <BackLinkWrapper>
      <SBackLinks>
        <h1>Backlinks</h1>
        {getBacklinks(useEditorStore.getState().node.id).map((l) => (
          <BackLink key={`backlink_${l.from}`} onClick={() => loadNodeFromId(l.from)}>
            {l.from}
          </BackLink>
        ))}
      </SBackLinks>
    </BackLinkWrapper>
  )
}

export default Backlinks
