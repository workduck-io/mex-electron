import React from 'react'
import Selector from './Selector'
import Screen from '../Screen'
import { ReturnType } from '@workduck-io/action-request-helper'
import { useActionStore } from '../../Actions/useActionStore'
import ActionForm from '../Forms'
import { mog } from '../../../../utils/lib/helper'

type PerformType = {
  actionId: string
  actionType: ReturnType
}

const Performer: React.FC<PerformType> = ({ actionId, actionType }) => {
  const getCacheResult = useActionStore((store) => store.getCacheResult)
  const selectionCache = useActionStore((store) => store.selectionCache)
  const activeAction = useActionStore((store) => store.activeAction)

  const context = getCacheResult(actionId)
  const cacheSelection = selectionCache[actionId]

  const data = context?.contextData?.map((res) => {
    const displayItem = res?.select

    return {
      label: displayItem?.label,
      value: res
    }
  })

  const value = cacheSelection?.selection ?? null

  const isForm = activeAction?.subType === 'form'

  switch (actionType) {
    case ReturnType.OBJECT:
      return (
        <Selector
          width={isForm ? '60vw' : '30%'}
          actionId={actionId}
          actionGroupId={activeAction?.actionGroupId}
          value={value}
          data={data}
        />
      )
    case ReturnType.NONE:
      return (
        <ActionForm actionId={actionId} actionGroupId={activeAction?.actionGroupId} subType={activeAction?.subType} />
      )
    case ReturnType.LIST:
      return <Screen actionGroupId={activeAction?.actionGroupId} actionId={actionId} />
    default:
      return <div>Nothing found!</div>
  }
}

export default Performer
