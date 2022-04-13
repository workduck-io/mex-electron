import menuFoldLine from '@iconify/icons-ri/menu-fold-line'
import menuUnfoldLine from '@iconify/icons-ri/menu-unfold-line'
import archiveFill from '@iconify/icons-ri/archive-fill'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import tinykeys from 'tinykeys'
import { useApi } from '../../../apis/useSaveApi'
import { BookmarksHelp, TreeHelp } from '../../../data/Defaults/helpText'
import { IpcAction } from '../../../data/IpcAction'
import { GetIcon } from '../../../data/links'
import { getUntitledDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
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
import {
  ComingSoon,
  Count,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  NavButton,
  NavLogoWrapper,
  NavTitle,
  NavWrapper
} from '../../../style/Nav'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import { Logo } from '../../../data/illustrations/logo'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import { useSidebarTransition } from './Transition'
import { TreeWithContextMenu } from './TreeWithContextMenu'
import { NavProps } from './Types'
import Bookmarks from './Bookmarks'
import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'

const Nav = ({ links }: NavProps) => {
  // const match = useMatch(`/${ROUTE_PATHS.node}/:nodeid`)
  const Tree = useTreeFromLinks()
  const authenticated = useAuthStore((store) => store.authenticated)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { getFocusProps } = useLayout()
  const { getLinkCount } = useLinks()
  const { goTo } = useRouting()
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

  const { springProps } = useSidebarTransition()

  const archiveCount = getLinkCount().archive

  return (
    <NavWrapper style={springProps} expanded={sidebar.expanded} {...getFocusProps(focusMode)}>
      <NavTooltip singleton={source} />

      <NavLogoWrapper>
        <Logo />
      </NavLogoWrapper>

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
        title="Bookmarks"
        oid="bookmarks"
        icon={bookmark3Line}
        maximumHeight="30vh"
        infoProps={{
          text: BookmarksHelp
        }}
      >
        <Bookmarks />
      </Collapse>

      <Collapse
        title="Tree"
        oid="tree"
        defaultOpen
        icon={gitBranchLine}
        maximumHeight="80vh"
        infoProps={{
          text: TreeHelp
        }}
      >
        <TreeWithContextMenu tree={Tree} />
      </Collapse>

      <EndLinkContainer>
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
            {archiveCount > 0 && <Count>{archiveCount}</Count>}
          </Link>
        </NavTooltip>
        {/* <NavTooltip
          singleton={target}
          content={<TooltipTitleWithShortcut title="Shortcuts" shortcut={shortcuts.showHelp.keystrokes} />}
        >
          <HelpTooltip />
        </NavTooltip> */}

        <NavButton onClick={toggleSidebar}>
          <Icon icon={sidebar.expanded ? menuFoldLine : menuUnfoldLine} />
          <NavTitle>{sidebar.expanded ? 'Collapse' : 'Expand'}</NavTitle>
        </NavButton>

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
      </EndLinkContainer>
    </NavWrapper>
  )
}

export default Nav
