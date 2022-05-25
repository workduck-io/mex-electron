import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import PerformersContainer from '@components/spotlight/ActionStage/Performers'
import React, { useEffect, useState } from 'react'
import { useSelected } from 'slate-react'
import styled from 'styled-components'
import { StyledInlineBlock } from '../InlineBlock/styled'
import { RootElement } from '../SyncBlock'
import ActionBlockHeader from './ActionBlockHeader'

interface ActionBlockProps {
  attributes: any
  element: any
}

const StyledActionBlock = styled(StyledInlineBlock)`
  overflow: hidden;
  position: relative;
`

const ActionBlock: React.FC<ActionBlockProps> = ({ attributes, element, children }) => {
  const [mounted, setMounted] = useState(false)
  const setElement = useActionStore((store) => store.setElement)
  const initAction = useActionStore((store) => store.initAction)

  const selected = useSelected()

  useEffect(() => {
    if (element.actionGroupId && element.actionId) {
      setElement(element)
      initAction(element.actionGroupId, element.actionId)
      setMounted(true)
    }
  }, [])

  if (!mounted) return <></>

  return (
    <RootElement {...attributes}>
      <StyledActionBlock selected={selected} contentEditable={false}>
        <ActionBlockHeader />
        <PerformersContainer />
      </StyledActionBlock>
      {children}
    </RootElement>
  )
}

export default ActionBlock
