import React, { forwardRef } from 'react'
import { FormField, TextFieldHeight } from '@workduck-io/action-request-helper'
import styled, { css } from 'styled-components'
import { Input, TextAreaBlock } from '../../../../../style/Form'

export const ActionInputContainer = styled(Input)`
  max-width: 12rem;
  min-width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-top: 0.5rem;
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
  onChange: any
  value: string
  type: TextFieldHeight
}

const ActionInput = forwardRef<any, ActionInputProps>((props, ref) => {
  return (
    <TextAreaBlock
      onChange={props.onChange}
      value={props.value}
      ref={ref}
      draggable={false}
      placeholder={props.element.options.placeholder}
      height={props.type}
    />
  )
})

ActionInput.displayName = 'ActionInput'

export default ActionInput
