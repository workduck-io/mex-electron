import Tippy from '@tippyjs/react'
import React, { useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { useLayoutStore } from '../../store/useLayoutStore'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon } from '@iconify/react'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../../hooks/useShortcutListener'
import { useHelpStore } from '../../store/useHelpStore'
import { TooltipTitleWithShortcut } from '../../components/mex/Shortcuts'
import useLayout from '../../hooks/useLayout'
import { focusStyles } from '../../style/focus'
import { FocusModeProp } from '../../style/props'
import { transparentize } from 'polished'

const LogoWrapper = styled.div<{ expanded: boolean }>`
  ${({ expanded }) => (expanded ? 'width: 100%;' : 'width: 40px;')}
`

export const Logo = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const theme = useTheme()

  return (
    <LogoWrapper expanded={sidebar.expanded}>
      <svg height="32" viewBox="0 0 32 32" fill={theme.colors.primary} xmlns="http://www.w3.org/2000/svg">
        <path d="M6.73943 11.6292C3.7743 10.8513 2.21681 9.72041 0 6.17839C2.35657 18.2186 5.8755 23.1172 13.6727 27.0941C9.73444 21.9698 7.43539 17.8271 6.73943 11.6292Z" />
        <path d="M17.9045 31.3889C12.424 23.4841 9.25471 14.4759 9.25471 5.43732C11.2611 8.58421 12.5942 9.56617 15.2604 10.6954C16.0504 15.6543 18.5564 20.2029 21.758 24.0325C20.5808 26.9418 19.915 28.0831 17.9045 31.3889Z" />
        <path d="M22.5694 21.7885C24.1654 16.2449 24.7585 11.7113 25 5C23.0615 8.75546 21.4815 10.3266 18.7432 11.2846C19.0679 14.3424 20.6559 19.3817 22.5694 21.7885Z" />
      </svg>
    </LogoWrapper>
  )
}

interface SidebarToggleWrappperProps extends FocusModeProp {
  expanded: boolean
}

export const SidebarToggleWrapper = styled.div<SidebarToggleWrappperProps>`
  position: absolute;
  ${(props) => focusStyles(props)}
  ${({ expanded, theme }) =>
    expanded
      ? css`
          top: ${theme.additional.hasBlocks ? 76 : 46}px;
          left: ${theme.additional.hasBlocks ? 296 : 325}px;
        `
      : css`
          top: ${theme.additional.hasBlocks ? 84 : 36}px;
          left: ${theme.additional.hasBlocks ? 86 : 84}px;
        `}
  transition: left 0.5s ease, top 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
  z-index: 11;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: ${({ theme }) => transparentize(0.75, theme.colors.gray[8])};

  &:hover {
    cursor: pointer;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
    background-color: ${({ theme }) => transparentize(0.25, theme.colors.gray[8])};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

export const TrafficLightBG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 86px;
  height: 32px;
  background-color: transparent;
  opacity: 0.9;
  z-index: 10000;
  border-radius: 0 0 10px;
`
export const SidebarToggle = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)

  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)

  /** Set shortcuts */
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  const focusMode = useLayoutStore((state) => state.focusMode)
  const { getFocusProps } = useLayout()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleSidebar.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSnippets, () => {
          toggleSidebar()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tippy
      theme="mex-bright"
      placement="right"
      content={
        <TooltipTitleWithShortcut
          title={sidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          shortcut={shortcuts.toggleSidebar.keystrokes}
        />
      }
    >
      <SidebarToggleWrapper onClick={toggleSidebar} expanded={sidebar.expanded} {...getFocusProps(focusMode)}>
        <Icon icon={sidebar.expanded ? arrowLeftSLine : arrowRightSLine} />
      </SidebarToggleWrapper>
    </Tippy>
  )
}
