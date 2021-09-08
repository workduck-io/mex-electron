import styled from 'styled-components'
import { Draggable } from '../Actions/styled'
import WDLogo from '../Search/Logo'
import React from 'react'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'

const StyledBubble = styled.div<{ modal?: boolean }>`
  margin: 0.4rem 0.4rem 0.4rem 0rem;
  left: 0;
  top: 0;
  z-index: 1000;
  background-color: white;
  display: ${({ modal }) => (modal ? 'block' : 'none')};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  padding: 0.5rem;
  position: fixed;
  ${Draggable};
`
const Badge = styled.span`
  position: absolute;
  background-color: #e74f4f;
  padding: 5px;
  border-radius: 50%;
  top: 4px;
  ${Draggable}
  right: 8px;
`

const Bubble = () => {
  const bubble = useSpotlightSettingsStore((state) => state.bubble)

  return (
    <StyledBubble modal={bubble}>
      <WDLogo />
      <Badge />
    </StyledBubble>
  )
}

export default Bubble
