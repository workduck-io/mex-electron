import React from 'react'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import CheckCircleIcon from '@iconify-icons/ph/check-circle-bold'
import ProhibitIcon from '@iconify-icons/ph/prohibit-bold'
import { MarginHorizontal, StyledContainer, StyledIcon, StyledSetting } from './styled'

const SpotlightSettings = () => {
  const { showSource, toggleSource } = useSpotlightSettingsStore()

  return (
    <StyledContainer>
      <StyledSetting>
        Show source of selected content in spotlight:{' '}
        <MarginHorizontal>
          {showSource ? (
            <StyledIcon fontSize={20} icon={CheckCircleIcon} color="show" onClick={() => toggleSource(false)} />
          ) : (
            <StyledIcon fontSize={20} icon={ProhibitIcon} onClick={() => toggleSource(true)} />
          )}
        </MarginHorizontal>
      </StyledSetting>
    </StyledContainer>
  )
}

export default SpotlightSettings
