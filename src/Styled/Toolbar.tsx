import styled, { css } from 'styled-components'
import { BalloonToolbar, ToolbarMark, ToolbarElement, ToolbarList } from '@udecode/plate'

const commonStyles = css`
  color: ${({ theme }) => theme.colors.secondary};
  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
  .slate-ToolbarButton-active,
  .slate-ToolbarButton:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
export const BToolbar = styled(BalloonToolbar)`
  ${commonStyles}
  .slate-BalloonToolbar {
    background-color: ${({ theme }) => theme.colors.gray[9]} !important;
  }
`
export const TMark = styled(ToolbarMark)`
  ${commonStyles}
`
export const TElement = styled(ToolbarElement)`
  ${commonStyles}
`
export const TList = styled(ToolbarList)`
  ${commonStyles}
`
