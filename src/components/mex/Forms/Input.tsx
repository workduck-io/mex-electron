import Tippy from '@tippyjs/react/headless' // different import path!
import React from 'react'
import { InputBlock, Label, InputWrapper } from '../../../style/Form'
import { ErrorTooltip } from '../../../style/tippy'
import { errorMessages } from '../Auth/errorMessages'

export interface LabeledInputProps {
  name: string
  label: string
  inputProps?: any
  labelProps?: any
  error?: string
}

const Input = ({ name, label, inputProps, labelProps, error }: LabeledInputProps) => {
  // console.log({ name, label, inputProps, labelProps, error })

  return (
    <InputWrapper key={`FormInput_${name}_${label}`}>
      <Tippy
        render={(attrs) => (
          <ErrorTooltip tabIndex={-1} {...attrs}>
            {error}
          </ErrorTooltip>
        )}
        placement="right"
        duration={5000}
        appendTo={() => document.body}
        visible={error !== undefined}
      >
        <Label error={error !== undefined} htmlFor={name} {...labelProps}>
          {label}
        </Label>
      </Tippy>
      <InputBlock error={error !== undefined} key={`login-form-${name} `} {...inputProps} />
    </InputWrapper>
  )
}

export interface ErroredInputProps extends LabeledInputProps {
  name: string
  label: string
  inputProps?: any
  labelProps?: any
  errors?: any
}

export const InputFormError = ({ errors, ...props }: ErroredInputProps) => {
  const { name, label } = props
  const error = errors[name] ? errorMessages[errors[name].type](label) : undefined
  return <Input {...props} error={error} />
}

export default Input
