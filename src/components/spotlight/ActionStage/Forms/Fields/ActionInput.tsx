import React from 'react'
import { FormField } from '@workduck-io/action-request-helper'
import styled from 'styled-components'
import { Input } from '../../../../../style/Form'
import { lighten, opacify } from 'polished'

export const ActionInputContainer = styled(Input)`
  max-width: 12rem;
  min-width: 50%;
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-top: 1rem;
  box-sizing: border-box;
  padding-left: 0.7rem;

  ::placeholder {
    color: ${(props) => props.theme.colors.gray[4]};
    opacity: 0.8;
    font-size: 0.96rem;
  }
`

export type ActionInputProps = {
  actionId: string
  actionGroupId: string
  element: FormField
}

const ActionInput: React.FC<ActionInputProps> = ({ actionId, actionGroupId, element }) => {
  return <ActionInputContainer placeholder={element.options.placeholder} />
}

export default ActionInput
