import React from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'

export const StyledList = styled(animated.div)`
  overflow: hidden auto;
  position: relative;
  scroll-behavior: smooth;
  max-height: 425px;
`

export const ListItem = styled.div<{ start: number }>`
  position: absolute;
  transform: translateY(${(props) => props.start}px);
  width: 100%;
  cursor: pointer;
`

export function usePointerMovedSinceMount() {
  const [moved, setMoved] = React.useState(false)

  React.useEffect(() => {
    function handler() {
      setMoved(true)
    }

    if (!moved) {
      window.addEventListener('pointermove', handler)
      return () => window.removeEventListener('pointermove', handler)
    }
  }, [moved])

  return moved
}
