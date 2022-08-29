import React from 'react'
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react-dom-interactions'
import { Props } from './types'
import { Floating } from './Floating'
import { mog } from '@utils/lib/helper'

export const NestedFloating: React.FC<Props> = (props) => {
  const parentId = useFloatingParentNodeId()

  if (parentId == null) {
    mog('Is FLOATING TREE NULL')
    return (
      <FloatingTree>
        <Floating {...props} />
      </FloatingTree>
    )
  }

  return <Floating {...props} />
}
