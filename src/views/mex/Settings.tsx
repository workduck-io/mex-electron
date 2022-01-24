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

const SettingsContainer = styled.section`
  display: flex;
  width: 100%;
`

const SettingsOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

const SettingTitle = styled(NavLink)`
  padding: 1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.default};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.background.card};
    color: ${({ theme }) => theme.colors.primary};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

const SettingsContent = styled.div`
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
            Themes
          </SettingTitle>
          <SettingTitle exact tabIndex={-1} activeClassName="active" to={`${path}/user`}>
            Profile
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/shortcuts`}>
            Shortcuts
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/about`}>
            About
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/import`}>
            Import Notes
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/autoupdate`}>
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
