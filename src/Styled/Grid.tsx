import styled, { css } from 'styled-components'
import { size } from './responsive'

interface GridProps {
  showGraph: boolean
}

export const GridWrapper = styled.div<GridProps>`
  height: 100vh;
  width: 100vw;
  display: grid;
  /* grid-gap: ${({ theme }) => theme.spacing.tiny}; */

  /* Columns conditions
    - Small - no graph
    - large - graph, no graph
  */

  ${({ showGraph, theme }) => {
    return showGraph
      ? css`
          @media (max-width: ${size.normal}) {
            grid-template-columns: ${theme.width.sidebar}px 1.5fr 1.5fr;
          }

          @media (min-width: ${size.normal}) {
            grid-template-columns: ${theme.width.sidebar}px 2fr 1.5fr;
          }
        `
      : css`
          @media (max-width: ${size.normal}) {
            grid-template-columns: ${theme.width.sidebar}px 1fr auto;
          }
          @media (min-width: ${size.normal}) {
            grid-template-columns: ${theme.width.sidebar}px 1fr ${theme.width.sidebar}px;
          }
        `
  }}
`
