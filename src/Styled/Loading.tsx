import styled, { keyframes } from 'styled-components'

import React from 'react'

const loadingFade = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.8; }
  100% { opacity: 0; }
`

const LoadingWrapper = styled.div<LoadingProps>`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: ${({ theme }) => theme.colors.gray[9]};

  border-radius: 5px;

  max-width: ${({ dots }) => `${dots * 24}px`};
`

const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background: ${({ theme }) => theme.colors.primary};

  border-radius: 50%;

  opacity: 0;

  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.primary};

  animation: ${loadingFade} 1s infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }

  &:nth-child(4) {
    animation-delay: 0.3s;
  }
`

export interface LoadingProps {
  dots: number
}

const Loading = ({ dots }: LoadingProps) => {
  return (
    <LoadingWrapper dots={dots}>
      {Array(dots)
        .fill(0)
        .map((e, i) => (
          <LoadingDot key={`loadingDot${i}`}></LoadingDot>
        ))}
    </LoadingWrapper>
  )
}

export default Loading
