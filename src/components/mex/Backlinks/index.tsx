import { FloatingDelayGroup } from '@floating-ui/react-dom-interactions'
import arrowGoBackLine from '@iconify/icons-ri/arrow-go-back-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { BacklinksHelp } from '../../../data/Defaults/helpText'
import { useLinks } from '../../../hooks/useLinks'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import NodeLink from '../NodeLink/NodeLink'

interface BackLinkProps {
  nodeid: string
}

const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks } = useLinks()
  const backlinks = getBacklinks(nodeid)

  return (
    <InfoWidgetWrapper>
      <FloatingDelayGroup delay={{ open: 1000 }}>
        <Collapse
          maximumHeight="40vh"
          defaultOpen
          icon={arrowGoBackLine}
          title="Backlinks"
          infoProps={{
            text: BacklinksHelp
          }}
        >
          {backlinks.length === 0 && (
            <>
              <Note>No backlinks found.</Note>
              <Note>Link from other notes to view them here.</Note>
            </>
          )}
          {backlinks.map((l, i) => (
            <NodeLink key={`backlink_${l.nodeid}_${i}`} keyStr={`backlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
          ))}
        </Collapse>
      </FloatingDelayGroup>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
