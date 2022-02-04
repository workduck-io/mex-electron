import React from 'react'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { useSettingsShortcuts } from '../../../hooks/listeners/useSettingsShortcuts'
import { StyledLookup } from '../styled'
import { CenterIcon } from '../../../style/spotlight/layout'
import WDLogo from '../Search/Logo'
import ToggleButton from '../ToggleButton'
import { useSpotlightSettingsStore } from '../../../store/settings.spotlight'
import { SettingsContainer, StyledHeadingContainer, SettingOption, Title } from './styled'

const Settings = () => {
  useSettingsShortcuts()

  const { showSource, toggleSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))

  const onChange = () => {
    // toggleSource(!showSource)
  }

  return (
    <StyledLookup>
      <StyledHeadingContainer>
        <Title>SETTINGS</Title>
        <CenterIcon>
          <WDLogo />
        </CenterIcon>
      </StyledHeadingContainer>
      <SettingsContainer>
        <SettingOption>
          <div>Show source of selected content in Preview </div>
          <ToggleButton id="toggle-source" value={showSource} onChange={onChange} checked={showSource} />
        </SettingOption>
      </SettingsContainer>
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default Settings
