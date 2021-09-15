import React from 'react'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { Shortcut, StyledKey, StyledShortcuts } from './styled'

export enum ShortcutType {
  NEW,
  HOME,
}

const Shortcuts: React.FC<{ type: ShortcutType }> = ({ type }) => {
  const { search } = useSpotlightContext()

  if (type === ShortcutType.NEW) {
    return (
      <StyledShortcuts justifyContent="space-between">
        <Shortcut>
          <StyledKey>CMD+S</StyledKey> TO SAVE
        </Shortcut>
        <Shortcut>
          <StyledKey>ESC</StyledKey> TO DISMISS
        </Shortcut>
      </StyledShortcuts>
    )
  }

  return (
    <StyledShortcuts>
      <Shortcut>
        <StyledKey>{search ? 'TAB' : 'ENTER'}</StyledKey> {search ? 'TO SELECT' : 'TO OPEN'}
      </Shortcut>
      <Shortcut>
        <StyledKey>OPTION</StyledKey> SETTINGS
      </Shortcut>
      <Shortcut>
        <StyledKey>ESC</StyledKey> TO DISMISS
      </Shortcut>
    </StyledShortcuts>
  )
}

export default Shortcuts
