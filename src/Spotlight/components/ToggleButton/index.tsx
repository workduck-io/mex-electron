import React from 'react'
import { Slider, Input, Label } from './styled'

export type ToggleButtonProps = {
  value?: any
  onChange?: () => void
  id?: string
  checked: boolean
  size?: string
  disabled?: boolean
  title?: string
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ value, title, size, disabled, onChange, id, checked }) => {
  return (
    <Label htmlFor={id} disabled={disabled} title={title} size={size}>
      <Input id={id} type="checkbox" value={value} checked={checked} onChange={onChange} />
      <Slider />
    </Label>
  )
}

export default ToggleButton
