import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless' // different import path!
import { Infobox } from '@workduck-io/mex-components'
import React from 'react'
import { InputBlock, Label, InputWrapper } from '../../../style/Form'
import { ErrorTooltip } from '../../../style/tippy'
import { errorMessages } from '../Auth/errorMessages'

export interface LabeledInputProps {
  name: string
  label: string
  inputProps?: any
  labelProps?: any
  labelIcon?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  additionalInfo?: string
  // Whether the input is transparent or not
  // Current transparent inputs lie on a card background with their label
  transparent?: boolean
  error?: string
}

const Input = ({
  name,
  label,
  inputProps,
  labelIcon,
  additionalInfo,
  transparent,
  labelProps,
  error
}: LabeledInputProps) => {
  // console.log({ name, label, inputProps, labelProps, error })

  return (
    <InputWrapper transparent={transparent} key={`FormInput_${name}_${label}`}>
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
        <Label transparent={transparent} error={error !== undefined} htmlFor={name} {...labelProps}>
          {label} {labelIcon && <Icon icon={labelIcon} />} {additionalInfo && <Infobox text={additionalInfo} />}
        </Label>
      </Tippy>
      <InputBlock error={error !== undefined} transparent={transparent} key={`form-input-${name} `} {...inputProps} />
    </InputWrapper>
  )
}

export interface ErroredInputProps extends LabeledInputProps {
  errors?: any
}

export const InputFormError = ({ errors, ...props }: ErroredInputProps) => {
  const { name, label } = props
  const error = errors[name] ? errorMessages[errors[name].type](label) : undefined
  return <Input {...props} error={error} />
}

export default Input
