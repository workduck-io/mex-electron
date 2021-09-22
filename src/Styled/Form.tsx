import { AppType } from '../Data/useInitialize'
import styled, { css, DefaultTheme, useTheme } from 'styled-components'
import Select from 'react-select'
import React from 'react'

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
