import styled, { css } from 'styled-components'

interface InputProps {
  isSelected?: boolean
}
export const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
