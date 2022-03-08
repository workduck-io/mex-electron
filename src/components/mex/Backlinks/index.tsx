import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import NodeLink from '../NodeLink/NodeLink'
import { DataInfoHeader } from './Backlinks.style'

interface BackLinkProps {
  nodeid: string
}
const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks } = useLinks()
  const { push } = useNavigation()
  const backlinks = getBacklinks(nodeid)
  const { getNodeIdFromUid } = useLinks()

  return (
    <InfoWidgetWrapper>
      <DataInfoHeader>
        <Icon icon={arrowGoBackLine}></Icon>
        Backlinks
      </DataInfoHeader>
      <InfoWidgetScroll>
        {backlinks.length === 0 && (
          <>
            <Note>No backlinks found.</Note>
            <Note>Link from other nodes to view them here.</Note>
          </>
        )}
        {backlinks.map((l, i) => (
          <NodeLink key={`backlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
        ))}
      </InfoWidgetScroll>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
