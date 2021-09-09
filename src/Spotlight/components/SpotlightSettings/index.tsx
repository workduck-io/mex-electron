import React from 'react'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import styled from 'styled-components'
import { Icon } from '@iconify/react'
import CheckCircleIcon from '@iconify-icons/ph/check-circle-bold'
import ProhibitIcon from '@iconify-icons/ph/prohibit-bold'

const StyledContainer = styled.div``

const StyledSetting = styled.div`
  align-items: center;
  display: flex;
  border-radius: 8px;
  padding: 0.8rem 0.5rem;
  font-weight: lighter;
  font-size: 0.9rem;
`

const StyledIcon = styled(Icon)`
  color: ${({ theme, color }) => (color ? theme.colors.palette.green : theme.colors.palette.red)};
`

const MarginHorizontal = styled.div`
  margin: 0 1rem;
`

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
