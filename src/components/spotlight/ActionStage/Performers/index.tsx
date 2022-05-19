import React from 'react'
import styled, { css } from 'styled-components'
import { useActionStore } from '../../Actions/useActionStore'
import { RightActionSection } from '../Forms/RightSection'
import Performer from './Performer'
import PreActions from './PreActions'

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

  const preActions = activeAction?.actionIds
  const type = activeAction?.renderType

  const isForm = activeAction?.subType === 'form'

  return (
    <Container>
      <MainSection overflow={isForm}>
        <PreActions actions={preActions} />
        {type && <Performer actionId={activeAction?.id} actionType={type} />}
      </MainSection>
      <RightActionSection actionId={activeAction?.id} actionGroupId={activeAction?.actionGroupId} />
    </Container>
  )
}
export default PerformersContainer
