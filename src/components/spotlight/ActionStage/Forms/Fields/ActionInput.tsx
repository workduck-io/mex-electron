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

const StaticTextArea = styled(TextAreaBlock)`
  resize: none;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-top: 0.5rem;
  box-sizing: border-box;
  padding-left: 0.7rem;
  font-size: 0.9rem;

  ::placeholder {
    color: ${(props) => props.theme.colors.gray[4]};
    opacity: 0.8;
  }
`

export type ActionInputProps = {
  actionId: string
  actionGroupId: string
  element: FormField
  onChange: any
  value: string
  error: any
  disabled?: boolean
  type: TextFieldHeight
}

const ActionInput = forwardRef<any, ActionInputProps>((props, ref) => {
  return (
    <StaticTextArea
      onChange={props.onChange}
      value={props.value}
      ref={ref}
      disabled={props.disabled}
      error={props.error}
      draggable={false}
      placeholder={props.element.options.placeholder}
      height={props.type}
    />
  )
})

ActionInput.displayName = 'ActionInput'

export default ActionInput
