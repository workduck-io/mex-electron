import PerformersContainer from '@components/spotlight/ActionStage/Performers'
import { mog } from '@utils/lib/helper'
import React, { useEffect } from 'react'
import { RootElement } from '../SyncBlock'

interface ActionBlockProps {
  attributes: any
  element: any
}

const ActionBlock: React.FC<ActionBlockProps> = ({ attributes, element, children }) => {
  useEffect(() => {
    mog('ACTION BLOCK ELEMENT', { element })
  }, [])

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        <PerformersContainer />
      </div>
      {children}
    </RootElement>
  )
}

export default ActionBlock
