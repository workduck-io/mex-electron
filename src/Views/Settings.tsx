import React from 'react'
import { Route, Switch, NavLink, useRouteMatch } from 'react-router-dom'
import Shortcuts from '../Components/Settings/Shortcuts'
import styled from 'styled-components'
import { IntegrationContainer, Title } from '../Styled/Integration'
import Themes from '../Components/Settings/Themes'
import About from '../Components/Settings/About'

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

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
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
  const { path, url } = useRouteMatch()
  return (
    <IntegrationContainer>
      <Title>Settings</Title>
      <SettingsContainer>
        <SettingsOptions>
          <SettingTitle exact tabIndex={-1} activeClassName="active" to={`${path}`}>
            Themes
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/shortcuts`}>
            Shortcuts
          </SettingTitle>
          <SettingTitle tabIndex={-1} activeClassName="active" to={`${path}/about`}>
            About
          </SettingTitle>
        </SettingsOptions>
        <SettingsContent>
          <Switch>
            <Route exact path={path}>
              <Themes />
            </Route>
            <Route path={`${path}/shortcuts`}>
              <Shortcuts />
            </Route>
            <Route path={`${path}/about`}>
              <About />
            </Route>
            {/* <Route path={`${path}/otherpath`}>
              <OtherPath />
            </Route> */}
          </Switch>
        </SettingsContent>
      </SettingsContainer>
    </IntegrationContainer>
  )
}

// function Topic() {
//   const { setting } = useParams()
//   return <h3>Requested topic ID: {setting}</h3>
// }

export default Settings
