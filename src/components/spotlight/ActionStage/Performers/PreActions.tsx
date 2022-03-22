import React from 'react'
import styled from 'styled-components'
import { ReturnType } from '@workduck-io/action-request-helper'
import { useActionStore } from '../../Actions/useActionStore'
import Performer from './Performer'

type PreActionProps = {
  actions: Array<string>
}

const Flex = styled.div`
  display: flex;
  height: fit-content;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

const PreActions: React.FC<PreActionProps> = ({ actions }) => {
  const configs = useActionStore((store) => store.actionConfigs)

  return (
    <Flex id="wd-mex-spotlight-preactions">
      {actions?.map((actionId: string) => {
        const type = ReturnType.OBJECT
        return <Performer key={actionId} actionId={actionId} actionType={type} />
      })}
    </Flex>
  )
}

export default PreActions
