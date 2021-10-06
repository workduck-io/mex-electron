import { Icon } from '@iconify/react'
import React from 'react'
import { components } from 'react-select'
import styled from 'styled-components'
import { getSyncServiceIcon } from '../../Editor/Components/SyncBlock/SyncIcons'
import { StyledSelect } from '../../Styled/Form'

/* eslint-disable @typescript-eslint/no-explicit-any */

const StyledLabel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} 8px`};
  background-color: ${({ theme }) => theme.colors.gray[8]};

  svg {
    color: ${({ theme }) => theme.colors.primary};
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
  // console.log({ props })

  return (
    <components.Option {...props}>
      <StyledOption>
        <Icon icon={getSyncServiceIcon(props.data.icon)} />
        {props.children}
      </StyledOption>
    </components.Option>
  )
}

const StyledValueContainer = styled(components.ValueContainer)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column !important;
  align-items: flex-start !important;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const ValueContainer = (props: any) => {
  // console.log({ props })

  return <StyledValueContainer {...props}>{props.children}</StyledValueContainer>
}

const StyledPlaceholder = styled(components.Placeholder)`
  margin-left: 0.75rem !important;
`

const Placeholder = (props: any) => {
  return <StyledPlaceholder {...props} />
}

const StyledInput = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.form.input.fg};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} 8px`};
  margin: ${({ theme: { spacing } }) => spacing.tiny} 0;
`

const Input = (props: any) => {
  if (props.isHidden) {
    return <components.Input {...props} />
  }
  return (
    <StyledInput>
      <components.Input {...props} />
    </StyledInput>
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
      components={{ MultiValueLabel, Option, ValueContainer, Input, Placeholder }}
      options={options}
      isMulti
    />
  )
}

export default ServiceSelector
