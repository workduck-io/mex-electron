import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveFill from '@iconify/icons-ri/archive-fill'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import tinykeys from 'tinykeys'
import { useApi } from '../../../apis/useSaveApi'
import { TreeHelp } from '../../../data/Defaults/helpText'
import { DRAFT_NODE } from '../../../data/Defaults/idPrefixes'
import { IpcAction } from '../../../data/IpcAction'
import { GetIcon } from '../../../data/links'
import { getNewDraftKey, getUntitledDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import useLayout from '../../../hooks/useLayout'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useAuthStore } from '../../../services/auth/useAuth'
import useDataStore, { useTreeFromLinks } from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { focusStyles } from '../../../style/focus'
import { NavButton } from '../../../style/Nav'
import { FocusModeProp } from '../../../style/props'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import { CollapseWrapper } from '../../../ui/layout/Collapse/Collapse.style'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import { TreeWithContextMenu } from './TreeWithContextMenu'
import { NavProps } from './Types'

export const NavWrapper = styled.div<FocusModeProp>`
  overflow: scroll;
  margin-top: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100%;
  position: fixed;
  width: ${({ theme }) => theme.width.sidebar}px;
  transition: opacity 0.3s ease-in-out;
  padding-top: 1rem;
  padding-left: 10px;
  gap: ${({ theme }) => theme.spacing.small};

  ${CollapseWrapper} {
    flex-grow: 1;
    width: 100%;
  }

  ${(props) => focusStyles(props)}
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

export const NavTitle = styled.span`
  flex-grow: 1;
`

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.text.fade};
`

export const Link = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.medium};
  text-decoration: none !important;

  font-size: 18px;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[10]};
    color: ${({ theme }) => theme.colors.text.heading};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.gray[9]};
    color: ${({ theme }) => theme.colors.primary};
  }
`

const MainLinkContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
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
  // const match = useMatch(`/${ROUTE_PATHS.node}/:nodeid`)
  const Tree = useTreeFromLinks()
  const authenticated = useAuthStore((store) => store.authenticated)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { getFocusProps } = useLayout()
  const { getLinkCount } = useLinks()
  const { goTo } = useRouting()
  const location = useLocation()
  const { saveNodeName } = useLoad()

  const [source, target] = useSingleton()

  const createNewNode = () => {
    const newNodeId = getUntitledDraftKey()
    const node = addILink({ ilink: newNodeId, showAlert: false })

    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)
    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)

    return node.nodeid
  }

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const nodeid = createNewNode()

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, () => {
          const nodeid = createNewNode()

          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <NavWrapper {...getFocusProps(focusMode)}>
      <NavTooltip singleton={source} />
      {authenticated && (
        <div>
          <NavTooltip
            key={shortcuts.newNode.title}
            singleton={target}
            content={<TooltipTitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
          >
            <NavButton primary onClick={onNewNote}>
              <Icon icon="fa6-regular:pen-to-square" />
            </NavButton>
          </NavTooltip>
        </div>
      )}
      <MainLinkContainer>
        {links.map((l) =>
          l.isComingSoon ? (
            <NavTooltip key={l.path} singleton={target} content={`${l.title} (Stay Tuned! 👀  )`}>
              <ComingSoon tabIndex={-1} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
              </ComingSoon>
            </NavTooltip>
          ) : (
            <NavTooltip
              key={l.path}
              singleton={target}
              content={l.shortcut ? <TooltipTitleWithShortcut title={l.title} shortcut={l.shortcut} /> : l.title}
            >
              <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={l.path} key={`nav_${l.title}`}>
                {l.icon !== undefined ? l.icon : l.title}
                <NavTitle>{l.title}</NavTitle>
                {l.count > 0 && <Count>{l.count}</Count>}
              </Link>
            </NavTooltip>
          )
        )}
      </MainLinkContainer>

      <Collapse
        title="Tree"
        defaultOpen
        icon={gitBranchLine}
        maximumHeight="80vh"
        infoProps={{
          text: TreeHelp
        }}
      >
        <TreeWithContextMenu tree={Tree} />
      </Collapse>
      <div>
        {/* {authenticated ? (
          <NavTooltip singleton={target} content="User">
            <Link  tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="/user" key="nav_user">
              {GetIcon(user3Line)}
            </Link>
          </NavTooltip>
        ) : (
          <NavTooltip singleton={target} content="Login">
            <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.login} key="nav_user" className="active">
              {GetIcon(lockPasswordLine)}
            </Link>
          </NavTooltip>
        )} */}
        <NavTooltip
          key={shortcuts.showArchive.title}
          singleton={target}
          content={<TooltipTitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
        >
          <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.archive} key="nav_search">
            {GetIcon(archiveFill)}
            <NavTitle>Archive</NavTitle>
            <Count>{getLinkCount().archive}</Count>
          </Link>
        </NavTooltip>
        {/* <NavTooltip
          singleton={target}
          content={<TooltipTitleWithShortcut title="Shortcuts" shortcut={shortcuts.showHelp.keystrokes} />}
        >
          <HelpTooltip />
        </NavTooltip> */}
        <NavTooltip
          key={shortcuts.showSettings.title}
          singleton={target}
          content={<TooltipTitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
        >
          <Link
            tabIndex={-1}
            className={(s) => (s.isActive ? 'active' : '')}
            to={`${ROUTE_PATHS.settings}/themes`}
            key="nav_settings"
          >
            {GetIcon(settings4Line)}
            <NavTitle>Settings</NavTitle>
          </Link>
        </NavTooltip>
      </div>
    </NavWrapper>
  )
}

export default Nav
