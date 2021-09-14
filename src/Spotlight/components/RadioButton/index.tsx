import React from 'react'
import { Slider, Input, Label } from './styled'

export type RadioButtonProps = {
  value?: any
  onChange?: (ev: any) => void
  id?: string
  checked: boolean
  size?: string
  disabled?: boolean
  title?: string
}

const RadioButton: React.FC<RadioButtonProps> = ({ value, title, size, disabled, onChange, id, checked }) => {
  return (
    <Label htmlFor={id} disabled={disabled} title={title} size={size}>
      <Input id={id} type="checkbox" value={value} checked={checked} onChange={onChange} />
      <Slider />
    </Label>
  )
}

export default RadioButton
