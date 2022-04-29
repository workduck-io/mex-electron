import styled, { css, keyframes } from 'styled-components'

import React from 'react'
import { range } from 'lodash'

const loadingFade = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.8; }
  100% { opacity: 0; }
`

export const LoadingWrapper = styled.div<LoadingProps>`
  display: flex;
  justify-content: space-around;
  ${({ theme, transparent }) =>
    !transparent &&
    css`
      padding: 10px;
      background: ${theme.colors.gray[9]};
    `}

  border-radius: 5px;

  ${({ orientation, dots }) =>
    orientation === 'vertical'
      ? css`
          flex-direction: column;
          max-height: ${dots * 24}px;
          gap: 0.5rem;
          margin: 1rem;
        `
      : css`
          max-width: ${dots * 24}px;
        `}
`

const LoadingDot = styled.div<{
  totalDots: number
  color?: string
  size?: string
  direction?: 'forward' | 'reverse'
}>`
  width: ${({ size }) => size ?? '8px'};
  height: ${({ size }) => size ?? '8px'};
  margin: 0 4px;
  ${({ theme, color }) =>
    color
      ? css`
          background: ${color};
          box-shadow: 0 2px 8px ${color};
        `
      : css`
          background: ${theme.colors.primary};
          box-shadow: 0 2px 8px ${theme.colors.primary};
        `}

  border-radius: 50%;

  opacity: 0;

  animation: ${loadingFade} 1s infinite;

  ${({ totalDots, direction }) =>
    range(totalDots).reduce((prev, d) => {
      return css`
        ${prev};
        &:nth-child(${d + 1}) {
          animation-delay: ${d * (direction === 'forward' ? 0.1 : -0.1)}s;
        }
      `
    }, css``)}
`

export interface LoadingProps {
  dots: number
  transparent?: boolean
  orientation?: 'horizontal' | 'vertical'
  direction?: 'forward' | 'reverse'
  color?: string
  size?: string
}

const Loading = ({ dots, transparent, color, size, orientation, direction }: LoadingProps) => {
  return (
    <LoadingWrapper transparent={transparent} orientation={orientation ?? 'horizontal'} dots={dots}>
      {Array(dots)
        .fill(0)
        .map((e, i) => (
          <LoadingDot
            direction={direction ?? 'forward'}
            color={color}
            size={size}
            totalDots={dots}
            key={`loadingDot${i}`}
          ></LoadingDot>
        ))}
    </LoadingWrapper>
  )
}

export default Loading
