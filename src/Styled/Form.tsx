import { AppType } from '../Data/useInitialize'
import styled, { css } from 'styled-components'

interface InputProps {
  isSelected?: boolean
  appType?: AppType
}
export const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
