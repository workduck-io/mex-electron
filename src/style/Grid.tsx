import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { size } from './responsive'

export const GridCss = (smCol = 2, lgCol = 3, spacing?: string) => css`
  display: grid;
  grid-gap: ${({ theme }) => spacing || theme.spacing.medium};

  @media (max-width: ${size.wide}) {
    grid-template-columns: repeat(${smCol}, 1fr);
  }

  @media (min-width: ${size.wide}) {
    grid-template-columns: repeat(${lgCol}, 1fr);
  }

  @media (max-width: ${size.small}) {
    grid-template-columns: repeat(1, 1fr);
  }
`

export const GridWrapper = styled(animated.div)<{ grid?: string }>`
  height: 100vh;
  width: 100vw;
  overflow: auto;
  display: grid;
  overflow-x: hidden;

  ${({ grid }) =>
    grid &&
    css`
      grid-template-columns: 300px 2fr auto;
    `}
`
