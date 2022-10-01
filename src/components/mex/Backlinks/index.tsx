import { FloatingDelayGroup } from '@floating-ui/react-dom-interactions'
import { ManagedOpenState } from '@ui/sidebar/Sidebar.types'
import { capitalize } from '@workduck-io/mex-utils'
import React from 'react'
import { BacklinksHelp, ForwardlinksHelp } from '../../../data/Defaults/helpText'
import { useLinks } from '../../../hooks/useLinks'
import { InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import NodeLink from '../NodeLink/NodeLink'

interface BackLinkProps {
  nodeid: string
  managedOpenState?: ManagedOpenState
}

const Backlinks = ({ nodeid, managedOpenState }: BackLinkProps) => {
  const { getBacklinks, getForwardlinks } = useLinks()
  const [state, setState] = React.useState<'backlink' | 'forwardlink'>('backlink')
  const backlinks = getBacklinks(nodeid)
  const forwardlinks = getForwardlinks(nodeid)

  const toggleState = () => {
    setState((s) => (s === 'backlink' ? 'forwardlink' : 'backlink'))
  }

  const linksToShow = state === 'backlink' ? backlinks : forwardlinks

  return (
    <InfoWidgetWrapper>
      <FloatingDelayGroup delay={{ open: 1000 }}>
        <Collapse
          maximumHeight="40vh"
          defaultOpen
          icon={`mex:${state}`}
          title={state === 'backlink' ? 'Backlinks' : 'Forwardlinks'}
          onTitleClick={toggleState}
          managedOpenState={managedOpenState}
          infoProps={{
            text: state === 'backlink' ? BacklinksHelp : ForwardlinksHelp
          }}
        >
          {linksToShow.length === 0 && (
            <>
              <Note>No {capitalize(state)}s found.</Note>
              <Note>
                Link {state === 'backlink' ? 'this note from other notes' : 'from this note'} to view them here.
              </Note>
            </>
          )}
          {linksToShow.map((l, i) => (
            <NodeLink key={`backforlink_${l.nodeid}_${i}`} keyStr={`backforlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
          ))}
        </Collapse>
      </FloatingDelayGroup>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
