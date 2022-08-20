import React from 'react'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

export const StyledList = styled(animated.div)`
  overflow: hidden auto;
  position: relative;
  scroll-behavior: smooth;
  overflow-behavior: contain;
  max-height: 425px;
`

export const ListItem = styled.div<{ start?: number }>`
  width: 100%;
  cursor: pointer;
  position: absolute;
  transform: translateY(${(props) => props.start}px);
`

export const ActionItem = styled.div<{ active?: boolean }>`
  width: 100%;
  ${(props) =>
    props.active &&
    css`
      z-index: 2;
    `}
  cursor: pointer;
`
