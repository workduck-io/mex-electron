import React from 'react'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { useSettingsShortcuts } from '../../../Spotlight/shortcuts/useSettingsShortcuts'
import { StyledLookup } from '../Spotlight/styled'
import { CenterIcon } from '../../styles/layout'
import WDLogo from '../Search/Logo'
import ToggleButton from '../ToggleButton'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import { SettingsContainer, StyledHeadingContainer, SettingOption, Title } from './styled'

const Settings = () => {
  useSettingsShortcuts()

  const { showSource, toggleSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))

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
          <ToggleButton
            id="toggle-source"
            value={showSource}
            onChange={() => toggleSource(!showSource)}
            checked={showSource}
          />
        </SettingOption>
      </SettingsContainer>
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default Settings
