import React from 'react'
import Select from 'react-select'
import styled, { css, DefaultTheme, useTheme } from 'styled-components'
import { AppType } from '../Data/useInitialize'

interface InputProps {
  isSelected?: boolean
  appType?: AppType
  error?: boolean
  center?: boolean
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

  ${({ center }) =>
    center &&
    css`
      text-align: center;
      color: ${({ theme }) => theme.colors.primary};
    `}

  ${({ theme, error }) =>
    error &&
    css`
      border-color: ${theme.colors.palette.red};
    `}
`

export const InputBlock = styled(Input)`
  width: 100%;
  display: block;
  ${({ center, theme }) =>
    center
      ? css`
          margin-top: ${({ theme }) => theme.spacing.medium};
        `
      : css`
          margin: ${({ theme }) => theme.spacing.small} 0;
        `}
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

interface LabelProps {
  error?: boolean
}

export const Label = styled.label<LabelProps>`
  color: ${({ theme }) => theme.colors.text.fade};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0 3px`};
  display: block;
  ${({ theme, error }) =>
    error &&
    css`
      color: ${theme.colors.palette.red};
    `}
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
