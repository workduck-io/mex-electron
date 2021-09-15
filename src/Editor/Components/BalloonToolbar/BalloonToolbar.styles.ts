import { ToolbarBase } from '@udecode/plate'
import { createStyles } from '@udecode/plate-styled-components'
import { transparentize } from 'polished'
import styled, { css, CSSProp } from 'styled-components'
import { getToolbarStyles } from '../Toolbar/Toolbar.styles'
import { BalloonToolbarStyleProps } from './BalloonToolbar.types'

export const StyledToolbarBase = styled<any>(ToolbarBase)`
  display: flex;
  align-items: center;
  user-select: none;
  box-sizing: content-border-box;
  color: rgb(68, 68, 68);
  min-height: 40px;
  position: absolute;
  white-space: nowrap;
  padding: 0px ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.default};
  background: ${({ theme }) => theme.colors.gray[8]};
  z-index: 500;
  border: 1px solid transparent;
  border-radius: 4px;
  margin-top: ${({ theme }) => theme.spacing.small};
  box-shadow: 0px 3px 9px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};

  .slate-ToolbarButton-active,
  .slate-ToolbarButton:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.gray[9]};
  }

  .slate-ToolbarButton {
    color: ${({ theme }) => theme.colors.text.default};
    padding: ${({ theme: { spacing } }) => `${spacing.tiny}`};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
  }

  ${({ arrow, theme }) =>
    arrow &&
    css`
      ::after {
        left: 50%;
        content: ' ';
        position: absolute;
        margin-top: -1px;
        transform: translateX(-50%);
        border-color: ${theme.colors.gray[8]} transparent;
        border-style: solid;
        top: 100%;
        bottom: auto;
        border-width: 8px 8px 0;
      }
    `}

  ${({ hidden }) =>
    hidden &&
    css`
      visibility: hidden;
    `}
          ${({ hiddenDelay }) =>
    !hiddenDelay &&
    css`
      transition: top 75ms ease-out, left 75ms ease-out;
    `}
`

export const getBalloonToolbarStyles = (props: BalloonToolbarStyleProps) => {
  let color = 'rgb(157, 170, 182)'
  let colorActive = 'white'
  let background = 'rgb(36, 42, 49)'
  let borderColor = 'transparent'

  if (props.theme === 'light') {
    color = 'rgba(0, 0, 0, 0.50)'
    colorActive = 'black'
    background = 'rgb(250, 250, 250)'
    borderColor = 'rgb(196, 196, 196)'
  }

  let marginTop
  const arrowStyle: CSSProp = [
    props.arrow &&
      css`
        ::after {
          left: 50%;
          content: ' ';
          position: absolute;
          margin-top: -1px;
          transform: translateX(-50%);
          border-color: ${background} transparent;
          border-style: solid;
        }
      `,

    props.arrow &&
      props.direction === 'top' &&
      css`
        ::after {
          top: 100%;
          bottom: auto;
          border-width: 8px 8px 0;
        }
      `,

    props.arrow &&
      props.direction !== 'top' &&
      css`
        ::after {
          top: auto;
          bottom: 100%;
          border-width: 0 8px 8px;
        }
      `
  ]

  const arrowBorderStyle: CSSProp = [
    props.arrow &&
      props.direction === 'top' &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 9px 9px 0;
          border-color: ${borderColor} transparent;
        }
      `,
    props.arrow &&
      props.direction !== 'top' &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 0 9px 9px;
          border-color: ${borderColor} transparent;
        }
      `
  ]

  if (props.direction === 'top') {
    marginTop = -9
  } else {
    marginTop = 9
  }

  return createStyles(
    { prefixClassNames: 'BalloonToolbar', ...props },
    {
      root: [
        ...getToolbarStyles(props).root.css,
        css`
          ${props.hidden &&
          css`
            visibility: hidden;
          `}
          ${!props.hiddenDelay &&
          css`
            transition: top 75ms ease-out, left 75ms ease-out;
          `}
          position: absolute;
          white-space: nowrap;
          padding: 0px ${({ theme }) => theme.spacing.small};
          color: ${color};
          background: ${background};
          z-index: 500;
          border: 1px solid ${borderColor};
          border-radius: 4px;
          margin-top: ${marginTop}px;

          .slate-ToolbarButton-active,
          .slate-ToolbarButton:hover {
            color: ${colorActive};
          }

          ::before {
            ${arrowBorderStyle}
          }
        `,
        ...arrowStyle,
        ...arrowBorderStyle
      ]
    }
  )
}
