import React from 'react'
import { Route, Switch, NavLink, useRouteMatch, useHistory } from 'react-router-dom'
import Shortcuts from '../../components/mex/Settings/Shortcuts'
import styled from 'styled-components'
import { IntegrationContainer, Margin, Title } from '../../style/Integration'
import Themes from '../../components/mex/Settings/Themes'
import About from '../../components/mex/Settings/About'
import AutoUpdate from '../../components/mex/Settings/AutoUpdate'
import Importers from '../../components/mex/Settings/Importers'
import UserPage from './UserPage'
import { CustomEvents } from '../../services/analytics/events'
import { useAuthentication } from '../../services/auth/useAuth'
import useAnalytics from '../../services/analytics'
import { Button } from '../../style/Buttons'
import { transparentize } from 'polished'

import informationLine from '@iconify-icons/ri/information-line'
import refreshLine from '@iconify-icons/ri/refresh-line'
import paintBrushFill from '@iconify-icons/ri/paint-brush-fill'
import keyboardBoxLine from '@iconify-icons/fluent/keyboard-24-regular'
import installLine from '@iconify-icons/ri/install-line'
import user3Line from '@iconify-icons/ri/user-3-line'
import { Icon } from '@iconify/react'

export const SettingsContainer = styled.section`
  display: flex;
  width: 100%;
`

export const SettingsOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

export const SettingTitle = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.default};
  gap: ${({ theme }) => theme.spacing.small};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    svg {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`

export const SettingsContent = styled.div`
  flex: 4;
`

const Settings = () => {
  const { path } = useRouteMatch()
  const { logout } = useAuthentication()
  const history = useHistory()

  const { addEventProperties } = useAnalytics()

  const onLogout = (e: any) => {
    e.preventDefault()
    logout()
    addEventProperties({ [CustomEvents.LOGGED_IN]: false })
    /**
     * Sessions ends after 30mins of inactivity
     *
     * identifyUser(undefined)
     * */

    history.push('/login')
  }

  return (
    <IntegrationContainer>
      <Title>Settings</Title>
      <SettingsContainer>
        <SettingsOptions>
          <SettingTitle exact tabIndex={-1} activeClassName="active" to={`${path}`}>
            <Icon icon={paintBrushFill} />
            Themes
          </SettingTitle>
          <SettingTitle exact tabIndex={-1} activeClassName="active" to={`${path}/user`}>
            <Icon icon={user3Line} />
            Profile
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/shortcuts`}>
            <Icon icon={keyboardBoxLine} />
            Shortcuts
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/about`}>
            <Icon icon={informationLine} />
            About
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/import`}>
            <Icon icon={refreshLine} />
            Import Notes
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/autoupdate`}>
            <Icon icon={installLine} />
            Automatic Updates
          </SettingTitle>
          <Margin />
          <Button onClick={onLogout}>Logout</Button>
        </SettingsOptions>
        <SettingsContent>
          <Switch>
            <Route exact path={path}>
              <Themes />
            </Route>
            <Route path={`${path}/user`} component={UserPage} />
            <Route path={`${path}/shortcuts`}>
              <Shortcuts />
            </Route>
            <Route path={`${path}/about`}>
              <About />
            </Route>
            <Route path={`${path}/autoupdate`}>
              <AutoUpdate />
            </Route>
            <Route path={`${path}/import`}>
              <Importers />
            </Route>
          </Switch>
        </SettingsContent>
      </SettingsContainer>
    </IntegrationContainer>
  )
}

export default Settings
