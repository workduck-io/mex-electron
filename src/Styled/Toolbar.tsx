import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

export const TippyBalloonStyles = css`
  .tippy-box[data-theme~='mex'] {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    color: ${({ theme }) => theme.colors.text.default};

    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: ${({ theme }) => theme.colors.gray[8]};
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: ${({ theme }) => theme.colors.gray[8]};
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: ${({ theme }) => theme.colors.gray[8]};
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: ${({ theme }) => theme.colors.gray[8]};
    }

    > .tippy-backdrop {
      background-color: ${({ theme }) => theme.colors.gray[8]};
    }

    > .tippy-svg-arrow {
      fill: ${({ theme }) => theme.colors.gray[8]};
    }
  }

  body .slate-BalloonToolbar {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
    box-shadow: 0px 3px 9px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
    &::after {
      border-color: ${({ theme }) => theme.colors.gray[8]} transparent;
    }
    .slate-ToolbarButton {
      color: ${({ theme }) => theme.colors.text.default};
      padding: ${({ theme: { spacing } }) => `${spacing.tiny}`};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
    .slate-ToolbarButton-active,
    .slate-ToolbarButton:hover {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.gray[9]};
    }
  }
`

export const ButtonSeparator = styled.div`
  height: 10px;
  margin: 0 ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
`
