import { transparentize } from 'polished'
import React from 'react'
// import AutoSave from '../Components/AutoSave'
import styled, { css } from 'styled-components'
import Nav, { navTooltip } from '../mex/Sidebar/Nav'
import { linkTooltip } from '../../editor/Components/Link'
import { GridWrapper } from '../../style/Grid'
import useNavlinks from '../../data/links'
import { useAuthStore } from '../../services/auth/useAuth'
import { useLayoutStore } from '../../store/useLayoutStore'

const AppWrapper = styled.div`
  min-height: 100%;
  overflow: auto;
  ${navTooltip};
  ${linkTooltip};
`

const Content = styled.div<{ grid?: boolean }>`
  display: flex;
  flex-grow: 1;
  overflow: auto;
  ${({ grid }) =>
    grid &&
    css`
      grid-column-start: 2;
    `}
`

const Draggable = styled.div`
  height: 24px;
  width: 100vw;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;

  &:hover,
  &:active {
    background-color: ${({ theme }) => transparentize(0.85, theme.colors.primary)};
  }
`

export type MainProps = { children: React.ReactNode }

const Main = ({ children }: MainProps) => {
  const styles = {
    WebkitAppRegion: 'drag'
  }
  const { getLinks } = useNavlinks()
  const authenticated = useAuthStore((state) => state.authenticated)
  const focusMode = useLayoutStore((s) => s.focusMode)

  return (
    <AppWrapper className={focusMode.on ? 'focus_mode' : ''}>
      <Draggable style={styles as any} /> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
      {/* <AutoSave /> */}
      <GridWrapper grid={authenticated ? 'true' : ''}>
        {authenticated && <Nav links={getLinks()} />}
        <Content id="wd-mex-content-view" grid={authenticated}>
          {children}
        </Content>
      </GridWrapper>
    </AppWrapper>
  )
}

export default Main
