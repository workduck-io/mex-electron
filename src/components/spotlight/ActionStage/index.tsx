import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../../style/Buttons'
import PerformersContainer from './Performers'
import { useActionStore } from '../Actions/useActionStore'
import { StyledContent } from '../Content/styled'

const Container = styled(StyledContent)`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  align-items: center;
  height: 100%;
`

type ActionStageProp = {
  id?: string
  name?: string
}

// * Perform an action on the stage
const ActionStage: React.FC<ActionStageProp> = ({ id = 'GET_GITHUB_REPO_ISSUES', name = 'And... ACTION!' }) => {
  const [doAction, setDoAction] = useState(undefined)
  const initAction = useActionStore((store) => store.initAction)

  return (
    <Container id="wd-mex-spotlight-action-stage">
      {doAction !== id ? (
        <Button
          onClick={() => {
            initAction('GITHUB', id)
            setDoAction(id)
          }}
        >
          {name}
        </Button>
      ) : (
        <PerformersContainer />
      )}
    </Container>
  )
}

export default ActionStage
