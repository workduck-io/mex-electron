import addCircleLine from '@iconify-icons/ri/add-circle-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import { useSingleton } from '@tippyjs/react'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import archiveFill from '@iconify-icons/ri/archive-fill'
import { FOCUS_MODE_OPACITY } from '../../../style/consts'
import styled, { css } from 'styled-components'
import tinykeys from 'tinykeys'
import { useApi } from '../../../apis/useSaveApi'
import { IpcAction } from '../../../data/IpcAction'
import { GetIcon } from '../../../data/links'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useAuthStore } from '../../../services/auth/useAuth'
import useDataStore from '../../../store/useDataStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { NavButton } from '../../../style/Nav'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import { NavProps } from './Types'
import { FocusModeProp } from '../../../style/props'
import toast from 'react-hot-toast'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../views/routes/urls'

export const NavWrapper = styled.div<FocusModeProp>`
  overflow: scroll;
  height: 100%;
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
      opacity: ${FOCUS_MODE_OPACITY};
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

export const Link = styled(NavLink)`
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

const MainLinkContainer = styled.div`
  margin: 2rem 0;
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
  const { saveNewNodeAPI } = useApi()

  const { goTo } = useRouting()
  const location = useLocation()

  const [source, target] = useSingleton()

  const createNewNode = () => {
    const newNodeId = getNewDraftKey()
    const node = addILink({ ilink: newNodeId })
    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)

    return node.nodeid
  }

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const nodeid = createNewNode()

    if (location.pathname !== '/editor') goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
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
    <NavWrapper focusMode={focusMode}>
      <NavTooltip singleton={source} />
      {authenticated && (
        <div>
          <NavTooltip
            singleton={target}
            content={<TooltipTitleWithShortcut title="Create New Node" shortcut={shortcuts.newNode.keystrokes} />}
          >
            <NavButton primary onClick={onNewNote}>
              {GetIcon(addCircleLine)}
            </NavButton>
          </NavTooltip>
        </div>
      )}
      <div></div>
      <MainLinkContainer>
        {links.map((l) =>
          l.isComingSoon ? (
            <NavTooltip singleton={target} content="Coming Soon!">
              <ComingSoon tabIndex={-1} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
              </ComingSoon>
            </NavTooltip>
          ) : (
            <NavTooltip
              singleton={target}
              content={l.shortcut ? <TooltipTitleWithShortcut title={l.title} shortcut={l.shortcut} /> : l.title}
            >
              <Link exact tabIndex={-1} activeClassName="active" to={l.path} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
              </Link>
            </NavTooltip>
          )
        )}
      </MainLinkContainer>
      <div>
        {/* {authenticated ? (
          <NavTooltip singleton={target} content="User">
            <Link exact tabIndex={-1} activeClassName="active" to="/user" key="nav_user">
              {GetIcon(user3Line)}
            </Link>
          </NavTooltip>
        ) : (
          <NavTooltip singleton={target} content="Login">
            <Link exact tabIndex={-1} activeClassName="active" to={ROUTE_PATHS.login} key="nav_user" className="active">
              {GetIcon(lockPasswordLine)}
            </Link>
          </NavTooltip>
        )} */}
        <NavTooltip
          singleton={target}
          content={<TooltipTitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
        >
          <Link exact tabIndex={-1} activeClassName="active" to={ROUTE_PATHS.archive} key="nav_search">
            {GetIcon(archiveFill)}
          </Link>
        </NavTooltip>
        {/* <NavTooltip
          singleton={target}
          content={<TooltipTitleWithShortcut title="Shortcuts" shortcut={shortcuts.showHelp.keystrokes} />}
        >
          <HelpTooltip />
        </NavTooltip> */}
        <NavTooltip
          singleton={target}
          content={<TooltipTitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
        >
          <Link exact tabIndex={-1} activeClassName="active" to={ROUTE_PATHS.settings} key="nav_settings">
            {GetIcon(settings4Line)}
            {/* <Icon icon={settings4Line} /> */}
          </Link>
        </NavTooltip>
      </div>
    </NavWrapper>
  )
}

export default Nav
