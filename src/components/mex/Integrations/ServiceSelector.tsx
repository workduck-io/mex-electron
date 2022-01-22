import React from 'react'
import { StyledSelect } from '../../../style/Form'
import { StyledServiceSelectComponents } from '../../../style/Select'

export interface ServiceSelectorProps {
  options: { label: string; value: any }[]
  onChange: (val: any, actionMeta: any) => void
  label: string
  inputRef?: any
}

const ServiceSelector = ({ options, onChange, label, inputRef }: ServiceSelectorProps) => {
  return (
    <StyledSelect
      inputRef={inputRef}
      label={label}
      onChange={onChange}
      components={StyledServiceSelectComponents}
      options={options}
      isMulti
    />
  )
}

export default ServiceSelector
