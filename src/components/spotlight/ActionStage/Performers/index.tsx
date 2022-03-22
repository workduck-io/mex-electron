import React from 'react'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import Performer from './Performer'
import PreActions from './PreActions'

export enum PerformerType {
  list = 'list',
  void = 'void',
  render = 'render'
}

const PerformersContainer = () => {
  const activeAction = useActionStore((store) => store.activeAction)

  const { isReady } = useActionPerformer()
  const preActions = activeAction?.actionIds
  const type = activeAction?.renderType

  return (
    <>
      <PreActions actions={preActions} />
      {type && isReady() && <Performer actionId={activeAction?.id} actionType={type} />}
    </>
  )
}
export default PerformersContainer
