import styled from 'styled-components'
import { Input } from '@style/Form'

interface SidebarListWrapperProps {
  noMargin?: boolean
}
export const SidebarListWrapper = styled.div<SidebarListWrapperProps>`
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: ${({ noMargin }) => (noMargin ? '0' : '4rem')};
  padding: ${({ theme }) => theme.spacing.small};
`

export const SidebarListFilter = styled.div<SidebarListWrapperProps>`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => `0 0 ${theme.spacing.small}`};
  margin-top: ${({ noMargin, theme }) => (noMargin ? '0' : theme.spacing.medium)};
  background: ${({ theme }) => theme.colors.form.input.bg};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${Input} {
    flex-grow: 1;
    background: transparent;
  }

  svg {
    flex-shrink: 0;
  }
`
