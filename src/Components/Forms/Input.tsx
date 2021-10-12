import Tippy from '@tippyjs/react/headless' // different import path!
import React from 'react'
import { InputBlock, Label } from '../../Styled/Form'
import { Tooltip } from '../../Styled/tippy'

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
    <div key={`FormInput_${name}_${label}`}>
      <Label error={error !== undefined} htmlFor={name} {...labelProps}>
        {label}
      </Label>
      <Tippy
        render={(attrs) => (
          <Tooltip tabIndex={-1} {...attrs}>
            {error}
          </Tooltip>
        )}
        placement="right"
        duration={5000}
        appendTo={() => document.body}
        visible={error !== undefined}
      >
        <InputBlock error={error !== undefined} key={`login-form-${name} `} {...inputProps} />
      </Tippy>
    </div>
  )
}

export default Input
