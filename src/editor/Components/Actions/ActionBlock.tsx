import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import PerformersContainer from '@components/spotlight/ActionStage/Performers'
import { mog } from '@utils/lib/helper'
import React, { memo, useEffect, useState } from 'react'
import { useSelected } from 'slate-react'
import { StyledActionBlock } from '.'
import ActionBlockHeader from './ActionBlockHeader'

type ActionBlockContainerProps = {
  element: any
}

const ActionBlockContainer: React.FC<ActionBlockContainerProps> = ({ element }) => {
  const selected = useSelected()
  const [mounted, setMounted] = useState(false)
  const setElement = useActionStore((store) => store.setElement)
  const initActionWithElement = useActionStore((store) => store.initActionWithElement)

  mog('element', { element })

  useEffect(() => {
    if (element?.actionContext) {
      initActionWithElement(element?.actionContext)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    setElement(element)
  }, [element])

  if (!mounted) return <></>

  return (
    <StyledActionBlock selected={selected} contentEditable={false}>
      <ActionBlockHeader />
      <PerformersContainer />
    </StyledActionBlock>
  )
}

export default memo(ActionBlockContainer)
