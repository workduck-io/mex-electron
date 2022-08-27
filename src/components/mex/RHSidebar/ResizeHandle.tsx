import { mog } from '@utils/lib/helper'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Handle = styled.div`
  flex: none;
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  border-left: 1px solid #ccc;
  -webkit-touch-callout: none;
  user-select: none;

  &:hover,
  &:active {
    border-color: lightblue;
    border-style: double;
  }
`

export const ResizeHandle = () => {
  const handleRef = useRef<HTMLDivElement>(null)

  const resizeData = {
    tracking: false,
    startCursorScreenX: null,
    maxWidth: 500,
    minWidth: 350,
    startWidth: 400
  }

  useEffect(() => {
    const handleMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
      resizeData.startWidth = document.getElementById('sidebar').offsetWidth
      resizeData.startCursorScreenX = event.screenX
      resizeData.tracking = true
    }

    if (handleRef) {
      handleRef.current.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      handleRef?.current?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleRef])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (resizeData.tracking) {
        const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX
        let newWidth = Math.min(resizeData.startWidth - cursorScreenXDelta, resizeData.maxWidth)
        newWidth = Math.max(resizeData.minWidth, newWidth)
        document.getElementById('sidebar').style.width = newWidth + 'px'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [resizeData.tracking])

  useEffect(() => {
    const handleMouseUp = (event) => {
      if (resizeData.tracking) resizeData.tracking = false
    }
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizeData.tracking])

  return <Handle ref={handleRef}></Handle>
}
