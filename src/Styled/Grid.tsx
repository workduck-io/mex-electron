import styled, { css } from 'styled-components'

interface GridProps {
  showGraph: boolean
}
export const GridWrapper = styled.div<GridProps>`
  height: 100vh;
  width: 100vw;
  display: grid;
  /* grid-gap: ${({ theme }) => theme.spacing.tiny}; */

  ${({ showGraph, theme }) =>
    showGraph
      ? css`
          grid-template-columns: ${({ theme }) => theme.width.sidebar}px 2fr 1.5fr;
        `
      : css`
          grid-template-columns: ${({ theme }) => theme.width.sidebar}px 1fr ${({ theme }) => theme.width.sidebar}px;
        `}
`
