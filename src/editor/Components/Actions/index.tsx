import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import PerformersContainer from '@components/spotlight/ActionStage/Performers'
import React, { useEffect, useState } from 'react'
import { StyledInlineBlock } from '../InlineBlock/styled'
import { RootElement } from '../SyncBlock'

interface ActionBlockProps {
  attributes: any
  element: any
}

const ActionBlock: React.FC<ActionBlockProps> = ({ attributes, element, children }) => {
  const [mounted, setMounted] = useState(false)
  const initAction = useActionStore((store) => store.initAction)

  useEffect(() => {
    if (element.actionGroupId && element.actionId) {
      initAction(element.actionGroupId, element.actionId)
    }
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <RootElement {...attributes}>
      <StyledInlineBlock contentEditable={false}>
        <div>
          <PerformersContainer />
        </div>
      </StyledInlineBlock>
      {children}
    </RootElement>
  )
}

export default ActionBlock
