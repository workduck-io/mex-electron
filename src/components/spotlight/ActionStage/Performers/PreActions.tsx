import React from 'react'
import styled, { css } from 'styled-components'
import { ReturnType } from '@workduck-io/action-request-helper'
import Performer from './Performer'
import { useActionStore } from '../../Actions/useActionStore'
import ActionFormElement, { ElementContainer } from '../Forms/Fields/ActionFormElement'

type PreActionProps = {
  actions: Array<string>
}

const Flex = styled.div<{ isForm?: boolean }>`
  display: flex;
  height: fit-content;
  width: 100%;
  ${({ isForm }) =>
    isForm &&
    css`
      flex-direction: column;
      ${ElementContainer} {
        min-width: 60%;
      }
    `}
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

const PreActions: React.FC<PreActionProps> = ({ actions }) => {
  const view = useActionStore((store) => store.view)
  const activeAction = useActionStore((store) => store.activeAction)

  if (view === 'item') return <></>

  const isForm = activeAction?.subType === 'form'

  return (
    <Flex id="wd-mex-spotlight-preactions" isForm={isForm}>
      {actions?.map((actionId: string) => {
        const type = ReturnType.OBJECT

        if (isForm)
          return (
            <ActionFormElement required={true} key={actionId} label="Select">
              <Performer actionId={actionId} actionType={type} />
            </ActionFormElement>
          )

        return <Performer key={actionId} actionId={actionId} actionType={type} />
      })}
    </Flex>
  )
}

export default PreActions
