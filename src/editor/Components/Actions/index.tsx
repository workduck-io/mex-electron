import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import PerformersContainer from '@components/spotlight/ActionStage/Performers'
import React, { useEffect, useState } from 'react'
import { useSelected } from 'slate-react'
import { StyledInlineBlock } from '../InlineBlock/styled'
import { RootElement } from '../SyncBlock'
import ActionBlockHeader from './ActionBlockHeader'

interface ActionBlockProps {
  attributes: any
  element: any
}

const ActionBlock: React.FC<ActionBlockProps> = ({ attributes, element, children }) => {
  const [mounted, setMounted] = useState(false)
  const initAction = useActionStore((store) => store.initAction)
  const selected = useSelected()

  useEffect(() => {
    if (element.actionGroupId && element.actionId) {
      initAction(element.actionGroupId, element.actionId)
    }

    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <RootElement {...attributes}>
      <StyledInlineBlock selected={selected} contentEditable={false}>
        <ActionBlockHeader />
        <PerformersContainer />
      </StyledInlineBlock>
      {children}
    </RootElement>
  )
}

export default ActionBlock
