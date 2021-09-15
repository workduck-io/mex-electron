import WDLogo from '../Search/Logo'
import React from 'react'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { Badge, StyledBubble } from './styled'

const Bubble = () => {
  const bubble = useSpotlightSettingsStore((state) => state.bubble)
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  return (
    <StyledBubble modal={bubble}>
      <WDLogo />
      {nodeContent && <Badge />}
    </StyledBubble>
  )
}

export default Bubble
