import addCircleLine from '@iconify-icons/ri/add-circle-line'
import Tippy, { useSingleton } from '@tippyjs/react'
import searchLine from '@iconify-icons/ri/search-line'
import lockPasswordLine from '@iconify-icons/ri/lock-password-line'
import user3Line from '@iconify-icons/ri/user-3-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { GetIcon } from '../../Conf/links'
import { useAuthStore } from '../../Hooks/useAuth/useAuth'
import { useLayoutStore } from '../../Layout/LayoutStore'
import { NavProps } from './Types'
import HelpTooltip from '../Help/HelpTooltip'
import { NavTooltip } from '../Tooltips'
import { NavButton } from '../../Styled/Nav'
import { Icon } from '@iconify/react'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import useLoad from '../../Hooks/useLoad/useLoad'
import useDataStore from '../../Editor/Store/DataStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { AppType } from '../../Data/useInitialize'
import { IpcAction } from '../../Spotlight/utils/constants'
import { appNotifierWindow } from '../../Spotlight/utils/notifiers'
import { useHelpStore } from '../../Components/Help/HelpModal'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import tinykeys from 'tinykeys'

interface StyledDivProps {
  focusMode?: boolean
}

const StyledDiv = styled.div<StyledDivProps>`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  position: fixed;
  width: ${({ theme }) => theme.width.nav};
  transition: opacity 0.3s ease-in-out;
  padding-top: 1rem;

  ${({ focusMode }) =>
    focusMode &&
    css`
      opacity: 0.2;
      &:hover {
        opacity: 1;
      }
    `}
`

export const navTooltip = css`
  .nav-tooltip {
    color: ${({ theme }) => theme.colors.text.oppositePrimary} !important;
    background: ${({ theme }) => theme.colors.primary} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
  }
`

const ComingSoon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const Nav = ({ links }: NavProps) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()

  const [source, target] = useSingleton()

  const createNewNode = () => {
    const newNodeId = getNewDraftKey()
    const uid = addILink(newNodeId)
    push(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, newNodeId)
  }

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    createNewNode()
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, () => {
          createNewNode()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <StyledDiv focusMode={focusMode}>
      <NavTooltip singleton={source} />
      <div>
        <NavTooltip singleton={target} content="Create New Node">
          <NavButton onClick={onNewNote}>{GetIcon(addCircleLine)}</NavButton>
        </NavTooltip>
      </div>
      <div>
        {links.map((l) =>
          l.isComingSoon ? (
            <NavTooltip singleton={target} content="Coming Soon!">
              <ComingSoon tabIndex={-1} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
              </ComingSoon>
            </NavTooltip>
          ) : (
            <NavTooltip singleton={target} content={l.title}>
              <Link exact tabIndex={-1} activeClassName="active" to={l.path} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
              </Link>
            </NavTooltip>
          )
        )}
      </div>
      <div>
        {authenticated ? (
          <NavTooltip singleton={target} content="User">
            <Link exact tabIndex={-1} activeClassName="active" to="/user" key="nav_user">
              {GetIcon(user3Line)}
            </Link>
          </NavTooltip>
        ) : (
          <NavTooltip singleton={target} content="Login">
            <Link exact tabIndex={-1} activeClassName="active" to="/login" key="nav_user" className="active">
              {GetIcon(lockPasswordLine)}
            </Link>
          </NavTooltip>
        )}
        <NavTooltip singleton={target} content="Search">
          <Link exact tabIndex={-1} activeClassName="active" to="/search" key="nav_search">
            {GetIcon(searchLine)}
          </Link>
        </NavTooltip>
        <NavTooltip singleton={target} content="Shortcuts">
          <HelpTooltip />
        </NavTooltip>
        <NavTooltip singleton={target} content="Settings">
          <Link exact tabIndex={-1} activeClassName="active" to="/settings" key="nav_settings">
            {GetIcon(settings4Line)}
            {/* <Icon icon={settings4Line} /> */}
          </Link>
        </NavTooltip>
      </div>
    </StyledDiv>
  )
}

export default Nav
