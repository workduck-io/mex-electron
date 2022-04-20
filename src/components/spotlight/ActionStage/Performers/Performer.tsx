import React from 'react'
import Selector from './Selector'
import Screen from '../Screen'
import { ReturnType } from '@workduck-io/action-request-helper'
import { useActionStore } from '../../Actions/useActionStore'

type PerformType = {
  actionId: string
  actionType: ReturnType
}

const Performer: React.FC<PerformType> = ({ actionId, actionType }) => {
  const actionCache = useActionStore((store) => store.actionsCache)
  const activeAction = useActionStore((store) => store.activeAction)

  const action = actionCache[activeAction?.id]

  switch (actionType) {
    case ReturnType.OBJECT:
      return (
        <Selector
          actionId={actionId}
          actionGroupId={activeAction?.actionGroupId}
          value={action?.value}
          data={action?.data}
        />
      )
    case ReturnType.NONE:
      return <>Successfull</>
    case ReturnType.LIST:
      return <Screen actionGroupId={activeAction?.actionGroupId} actionId={actionId} />
    default:
      return <div>Nothing found!</div>
  }
}

export default Performer
