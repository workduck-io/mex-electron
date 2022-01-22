import WDLogo from '../Search/Logo'
import React from 'react'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { Badge, StyledBubble } from './styled'
import { useGlobalShortcuts } from '../../../hooks/listeners/useGlobalShortcuts'

const Bubble = () => {
  const bubble = useSpotlightSettingsStore((state) => state.bubble)
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  useGlobalShortcuts()

  return (
    <StyledBubble modal={bubble}>
      <WDLogo />
      {nodeContent && <Badge />}
    </StyledBubble>
  )
}

export default Bubble
