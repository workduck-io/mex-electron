/* eslint-disable import/no-unresolved */
import React from 'react'
import styled, { css } from 'styled-components'
import { useActionStore } from '../../Actions/useActionStore'
import { RightActionSection } from '../Forms/RightSection'
import Performer from './Performer'
import PreActions from './PreActions'
// import Lottie from 'lottie-react'
import { loader } from './loader'
import useActions from '@components/spotlight/Actions/useActions'
import ConnectService from '@components/spotlight/Actions/ConnectService'
import { useSpotlightAppStore } from '@store/app.spotlight'
import { ViewPage } from '../Screen/View'

export enum PerformerType {
  list = 'list',
  void = 'void',
  render = 'render'
}

const Container = styled.div`
  position: relative;
  height: 430px;
  max-height: 430px;
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
  const { getIsServiceConnected } = useActions()

  const preActions = activeAction?.actionIds
  const type = activeAction?.renderType

  const isForm = activeAction?.subType === 'form'
  const view = useSpotlightAppStore((store) => store.view) === 'item'

  const isConnected = getIsServiceConnected(activeAction.actionGroupId)

  return (
    <Container>
      <MainSection overflow={isForm}>
        {/* <Lottie height={100} width={100} loop autoplay animationData={loader} /> */}
        {isConnected ? (
          view ? (
            <ViewPage />
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
      <RightActionSection actionId={activeAction?.id} actionGroupId={activeAction?.actionGroupId} />
    </Container>
  )
}
export default PerformersContainer
