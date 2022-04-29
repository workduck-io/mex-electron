import styled, { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const FadeContainer = styled.div<{ fade: boolean }>`
  animation: ${({ fade }) =>
    fade
      ? css`
          ${fadeIn} 0.5s ease-in-out
        `
      : ''};
`
