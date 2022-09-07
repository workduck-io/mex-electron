import styled from 'styled-components'

export const TooltipWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[7]};
  color: ${({ theme }) => theme.colors.text.default};
  pointer-events: none;
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  font-size: 14px;
`
