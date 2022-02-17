import React from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'

export const StyledList = styled(animated.div)`
  overflow: hidden;
  position: relative;
  scroll-behavior: smooth;
  max-height: 400px;
`

export const ListItem = styled.div<{ start: number }>`
  position: absolute;
  /* top: 2; */
  /* left: 0; */
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
