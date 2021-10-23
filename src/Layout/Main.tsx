import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled, { useTheme } from 'styled-components'
import HelpTooltip from '../Components/Help/HelpTooltip'
import { Notifications } from '../Components/Notifications/Notifications'
import Nav, { navTooltip } from '../Components/Sidebar/Nav'
import links from '../Conf/links'
import { GridWrapper } from '../Styled/Grid'

const AppWrapper = styled.div`
  min-height: 100%;
  ${navTooltip};
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  grid-column-start: 2;
  overflow: auto;
`

export type MainProps = { children: React.ReactNode }

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  const theme = useTheme()

  return (
    <AppWrapper>
      <GridWrapper>
        <Nav links={links} />
        <Content>{children}</Content>
      </GridWrapper>
      <HelpTooltip />
      <ReactTooltip effect="solid" backgroundColor={theme.colors.gray[6]} arrowColor={theme.colors.gray[6]} />
      <Notifications />
    </AppWrapper>
  )
}

export default Main
