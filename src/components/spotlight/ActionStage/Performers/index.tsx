/* eslint-disable import/no-unresolved */
import React from 'react'
import styled, { css } from 'styled-components'
import { useActionStore } from '../../Actions/useActionStore'
import { RightActionSection } from '../Forms/RightSection'
import Performer from './Performer'
import PreActions from './PreActions'
// import Lottie from 'lottie-react'
import useActions from '@components/spotlight/Actions/useActions'
import ConnectService from '@components/spotlight/Actions/ConnectService'
import { ViewPage } from '../Screen/View'
import { mog } from '@utils/lib/helper'

export enum PerformerType {
  list = 'list',
  void = 'void',
  render = 'render'
}

const Container = styled.div`
  position: relative;
  height: 430px;
  max-height: 430px;
  width: 100%;
`

const MainSection = styled.div<{ overflow?: boolean }>`
  ${({ overflow }) =>
    overflow &&
    css`
      overflow: auto;
    `}

  height: 430px;
  max-height: 430px;
`

const PerformersContainer = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const element = useActionStore((store) => store.element)
  const { getIsServiceConnected } = useActions()

  const preActions = activeAction?.actionIds
  const type = activeAction?.renderType

  const isForm = activeAction?.subType === 'form'
  const view = useActionStore((store) => store.view) === 'item'

  const isConnected = getIsServiceConnected(activeAction?.actionGroupId)

  return (
    <Container>
      <MainSection overflow={isForm}>
        {isConnected ? (
          view || element?.actionContext?.view ? (
            <ViewPage context={element?.actionContext} />
          ) : (
            <>
              <PreActions actions={preActions} />
              {type && <Performer actionId={activeAction?.id} actionType={type} />}
            </>
          )
        ) : (
          <ConnectService />
        )}
      </MainSection>
      {isConnected && <RightActionSection actionId={activeAction?.id} actionGroupId={activeAction?.actionGroupId} />}
    </Container>
  )
}
export default PerformersContainer
