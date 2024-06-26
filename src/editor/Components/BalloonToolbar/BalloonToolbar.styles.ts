import { BalloonToolbarProps, getToolbarStyles, ToolbarBase } from '@udecode/plate'
import { createStyles } from '@udecode/plate-styled-components'
import { transparentize } from 'polished'
import styled, { css, CSSProp } from 'styled-components'

// import tw from 'twin.macro'
// import { getToolbarStyles } from '../Toolbar/Toolbar.styles';
import { BalloonToolbarStyleProps } from './BalloonToolbar.types'

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

  const { placement = 'top' } = props

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
      placement.includes('top') &&
      css`
        ::after {
          top: 100%;
          bottom: auto;
          border-width: 8px 8px 0;
        }
      `,

    props.arrow &&
      !placement.includes('top') &&
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
      placement.includes('top') &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 9px 9px 0;
          border-color: ${borderColor} transparent;
        }
      `,
    props.arrow &&
      !placement.includes('top') &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 0 9px 9px;
          border-color: ${borderColor} transparent;
        }
      `
  ]

  return createStyles(
    { prefixClassNames: 'BalloonToolbar', ...props },
    {
      root: [
        ...getToolbarStyles(props).root.css,
        css`
          position: absolute;
          white-space: nowrap;
          opacity: 100;
          transition: opacity 0.2s ease-in-out;
          color: ${color};
          background: ${background};
          z-index: 500;
          border: 1px solid ${borderColor};
          border-radius: 4px;

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

export const BalloonToolbarBase = styled(ToolbarBase)<BalloonToolbarProps>`
  display: flex;
  user-select: none;
  box-sizing: content-box;
  align-items: center;

  position: absolute;
  white-space: nowrap;
  opacity: 100;
  transition: opacity 0.2s ease-in-out;
  color: ${({ theme }) => theme.colors.text.default};
  background: ${({ theme }) => theme.colors.gray[8]};
  z-index: 500;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: 0 ${({ theme }) => theme.spacing.tiny};

  .slate-ToolbarButton-active,
  .slate-ToolbarButton:hover {
    /* padding: ${({ theme: { spacing } }) => `${spacing.tiny}`}; */
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
  }
`

export const BalloonToolbarInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny};

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`
