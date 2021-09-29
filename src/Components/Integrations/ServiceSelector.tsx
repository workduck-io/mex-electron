import { Icon } from '@iconify/react'
import React from 'react'
import { components } from 'react-select'
import styled, { css } from 'styled-components'
import { getSyncServiceIcon } from '../../Editor/Components/SyncBlock/SyncIcons'
import { StyledSelect } from '../../Styled/Form'

const StyledLabel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} 8px`};
  background-color: ${({ theme }) => theme.colors.gray[8]};

  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
`

export const MultiValueLabel = (props: any) => {
  // console.log({ props })

  return (
    <StyledLabel>
      <Icon icon={getSyncServiceIcon(props.data.icon)} />
      <components.MultiValueLabel {...props} />
    </StyledLabel>
  )
}

const StyledOption = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const Option = (props: any) => {
  console.log({ props })

  return (
    <components.Option {...props}>
      <StyledOption>
        <Icon icon={getSyncServiceIcon(props.data.icon)} />
        {props.children}
      </StyledOption>
    </components.Option>
  )
}

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
      components={{ MultiValueLabel, Option }}
      options={options}
      isMulti
    />
  )
}

export default ServiceSelector
