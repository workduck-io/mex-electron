import React from 'react'
import styled from 'styled-components'
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

const MainSection = styled.div`
  overflow: auto;

  height: 430px;
  max-height: 430px;
`

const PerformersContainer = () => {
  const activeAction = useActionStore((store) => store.activeAction)

  const preActions = activeAction?.actionIds
  const type = activeAction?.renderType
  const isRightSection = activeAction?.subType === 'form'

  return (
    <Container>
      <MainSection>
        <PreActions actions={preActions} />
        {type && <Performer actionId={activeAction?.id} actionType={type} />}
      </MainSection>
      {isRightSection && <RightActionSection actionGroupId={activeAction?.actionGroupId} isLoading={true} />}
    </Container>
  )
}
export default PerformersContainer
