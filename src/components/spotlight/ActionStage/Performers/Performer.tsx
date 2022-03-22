import React from 'react'
import Selector from './Selector'
import Screen from '../Screen'
import { ReturnType } from '@workduck-io/action-request-helper'

type PerformType = {
  actionId: string
  actionType: ReturnType
}

const Performer: React.FC<PerformType> = ({ actionId, actionType }) => {
  switch (actionType) {
    case ReturnType.OBJECT:
      return <Selector actionId={actionId} />
    case ReturnType.NONE:
      return <>Successfull</>
    case ReturnType.LIST:
      return <Screen actionId={actionId} />
    default:
      return <div>Nothing found!</div>
  }
}

export default Performer
