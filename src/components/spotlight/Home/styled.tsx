import React from 'react'
import styled from 'styled-components'

export const StyledList = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;
  max-height: 400px;
`

export const ListItem = styled.div<{ start: number }>`
  position: absolute;
  top: 0;
  left: 0;
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
