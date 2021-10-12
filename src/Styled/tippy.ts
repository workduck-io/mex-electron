import { transparentize } from 'polished'
import styled from 'styled-components'
import { CardShadow } from './helpers'

export const Tooltip = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;

  backdrop-filter: blur(8px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
`

export const ErrorTooltip = styled(Tooltip)`
  border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.palette.red)};
`
