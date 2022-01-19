import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import { HoverSubtleGlow } from '../../Styled/helpers'
import styled from 'styled-components'
import { useLinks } from '../../Editor/Actions/useLinks'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { Note } from '../../Styled/Typography'

const SBackLinks = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
`

export const NodeLink = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.75, theme.colors.gray[8])};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  &:nth-child(2n) {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  }

  ${HoverSubtleGlow}
`

export const DataInfoHeader = styled.div`
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
    <SBackLinks>
      <DataInfoHeader>
        <Icon icon={arrowGoBackLine}></Icon>
        Backlinks
      </DataInfoHeader>
      {backlinks.length === 0 && (
        <>
          <Note>No backlinks found.</Note>
          <Note>Link from other nodes to view them here.</Note>
        </>
      )}
      {backlinks.map((l, i) => (
        <NodeLink key={`backlink_${l.uid}_${i}`} onClick={() => push(l.uid)}>
          {getNodeIdFromUid(l.uid)}
        </NodeLink>
      ))}
    </SBackLinks>
  )
}

export default Backlinks
