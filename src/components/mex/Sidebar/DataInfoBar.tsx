import useManagedCollapse from '@ui/layout/Collapse/useManagedCollapse'
import { CollapsableHeaderTitle } from '@workduck-io/mex-components'
import React from 'react'
import styled from 'styled-components'
import { useEditorStore } from '../../../store/useEditorStore'
import Backlinks from '../Backlinks'
import Outline from '../Outline/Outline'
import SuggestionInfoBar from '../Suggestions'
import TagsRelated from '../Tags/TagsRelated'

export const DataInfobarWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(1 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 100%;
  overflow-y: auto;

  ${CollapsableHeaderTitle} {
    font-size: 1.5rem;
  }
`

const DataInfoBar = ({ wrapRef }: { wrapRef: React.RefObject<HTMLDivElement> }) => {
  const node = useEditorStore((state) => state.node)

  /**
   * Pass initial states to the hook
   */
  const { managedStates } = useManagedCollapse({
    states: [
      {
        key: 'outline',
        open: true,
        height: '20vh'
      },

      {
        key: 'suggestions',
        open: true,
        height: '25vh'
      },
      {
        key: 'backlinks',
        open: true,
        height: '25vh'
      }
    ],
    wrapperRef: wrapRef
  })

  return (
    <DataInfobarWrapper>
      <TagsRelated nodeid={node.nodeid} fromAnalysis />
      <SuggestionInfoBar managedOpenState={managedStates['suggestions']} />
      <Outline managedOpenState={managedStates['outline']} />
      <Backlinks nodeid={node.nodeid} managedOpenState={managedStates['backlinks']} />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
