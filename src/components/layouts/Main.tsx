import { transparentize } from 'polished'
import React from 'react'
// import AutoSave from '../Components/AutoSave'
import styled from 'styled-components'
import { Notifications } from '../Components/Notifications/Notifications'
import Nav, { navTooltip } from '../Components/Sidebar/Nav'
import useNavlinks from '../Conf/links'
import { linkTooltip } from '../Editor/Components/Link'
import { GridWrapper } from '../Styled/Grid'

const AppWrapper = styled.div`
  min-height: 100%;
  overflow: auto;
  ${navTooltip};
  ${linkTooltip};
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  grid-column-start: 2;
  overflow: auto;
`

const Draggable = styled.div`
  height: 12px;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;

  &:hover,
  &:active {
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  }
`

export type MainProps = { children: React.ReactNode }

const Main = ({ children }: MainProps) => {
  const styles = {
    WebkitAppRegion: 'drag'
  }
  const { getLinks } = useNavlinks()

  return (
    <AppWrapper>
      <Draggable style={styles as any} /> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
      {/* <AutoSave /> */}
      <GridWrapper>
        <Nav links={getLinks()} />
        <Content>{children}</Content>
      </GridWrapper>
      <Notifications />
    </AppWrapper>
  )
}

export default Main
