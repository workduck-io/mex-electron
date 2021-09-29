import React from 'react'
import Select from 'react-select'
import styled, { DefaultTheme, useTheme } from 'styled-components'
import { AppType } from '../Data/useInitialize'

interface InputProps {
  isSelected?: boolean
  appType?: AppType
}
export const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

export const InputBlock = styled(Input)`
  width: 100%;
  display: block;
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};

  &:focus {
    outline: 0;

    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::hover,
  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const TextAreaBlock = styled(TextArea)`
  width: 100%;
  display: block;
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.fade};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0 3px`};
  display: block;
`

export const ReactSelectStyles = (theme: DefaultTheme) => ({
  menu: (provided, state) => ({
    ...provided,
    // width: state.selectProps.width,
    color: state.selectProps.menuColor,
    backgroundColor: theme.colors.gray[8],
    padding: `${theme.spacing.tiny} ${theme.spacing.small}`
    // padding: 20,
  }),

  control: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.form.input.bg,
    borderColor: theme.colors.form.input.border
  }),

  option: (provided, state) => ({
    ...provided,
    borderRadius: theme.borderRadius.tiny,
    backgroundColor: state.isSelected || state.isFocused ? theme.colors.primary : 'transparent',
    color: state.isSelected || state.isFocused ? theme.colors.text.oppositePrimary : 'inherit',
    padding: '6px 10px',
    margin: `${theme.spacing.tiny} 0px`
  })
})

export const StyledSelect = (props) => {
  const theme = useTheme()
  return <Select {...props} theme={theme.additional.reactSelect} styles={ReactSelectStyles(theme)}></Select>
}
