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

  const action = actionCache[activeAction?.id]?.find((s) => s.actionId === actionId)

  const data = action?.data?.contextData?.map((item) => {
    const displayItem = item.select
    return {
      label: displayItem.value,
      value: item
    }
  })

  const value = action?.value ? { label: action?.value?.select?.value, value: action?.value } : null

  switch (actionType) {
    case ReturnType.OBJECT:
      return <Selector actionId={actionId} actionGroupId={activeAction?.actionGroupId} value={value} data={data} />
    case ReturnType.NONE:
      return <>Successfull</>
    case ReturnType.LIST:
      return <Screen actionGroupId={activeAction?.actionGroupId} actionId={actionId} />
    default:
      return <div>Nothing found!</div>
  }
}

export default Performer
