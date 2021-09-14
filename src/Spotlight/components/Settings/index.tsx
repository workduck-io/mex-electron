import React from 'react'
import styled from 'styled-components'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { useSettingsShortcuts } from '../../../Spotlight/utils/context'
import { StyledContent } from '../Content/index'
import { ActionTitle, Draggable } from '../Actions/styled'
import { StyledSearch } from '../Search/styled'
import { StyledLookup } from '../Spotlight/styled'
import { CenterIcon } from '../../styles/layout'
import WDLogo from '../Search/Logo'
import RadioButton from '../RadioButton'
import Message from '../Message'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'

export const StyledHeadingContainer = styled(StyledSearch)`
  padding: 0.75rem 0.25rem;
`

export const Title = styled(ActionTitle)`
  font-weight: bold;
  font-size: 1rem;
  margin-left: 1rem;
  margin-bottom: 0px;
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`

export const SettingsContainer = styled(StyledContent)`
  ${Draggable}
  overflow-y: auto;
  padding: 1rem;
`

export const SettingOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
`

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
          <RadioButton
            id="toggle-source"
            value={showSource}
            onChange={({ target }: any) => toggleSource(target.value)}
            checked={showSource}
          />
        </SettingOption>
      </SettingsContainer>
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default Settings
