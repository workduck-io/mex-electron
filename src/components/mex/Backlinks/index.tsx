import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useEditorStore } from '../../../store/useEditorStore'
import { HoverSubtleGlow } from '../../../style/helpers'
import { Note } from '../../../style/Typography'
import { DataInfoHeader, NodeLink, SBackLinks } from './Backlinks.style'

interface BackLinkProps {
  nodeid: string
}
const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks } = useLinks()
  const { push } = useNavigation()
  const backlinks = getBacklinks(nodeid)
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
        <NodeLink key={`backlink_${l.nodeid}_${i}`} onClick={() => push(l.nodeid)}>
          {getNodeIdFromUid(l.nodeid)}
        </NodeLink>
      ))}
    </SBackLinks>
  )
}

export default Backlinks
