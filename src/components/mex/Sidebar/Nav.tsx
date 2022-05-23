import { BookmarksHelp, SharedHelp, TreeHelp } from '@data/Defaults/helpText'
import { Logo, SidebarToggle, TrafficLightBG } from '@data/illustrations/logo'
import { GetIcon } from '@data/links'
import { useCreateNewNode } from '@hooks/useCreateNewNode'
import useLayout from '@hooks/useLayout'
import { useLinks } from '@hooks/useLinks'
import { useKeyListener } from '@hooks/useShortcutListener'
import archiveFill from '@iconify/icons-ri/archive-fill'
import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
import { useTreeFromLinks } from '@store/useDataStore'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { useSingleton } from '@tippyjs/react'
import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import {
  ComingSoon,
  Count,
  CreateNewButton,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  NavDivider,
  NavLogoWrapper,
  NavSpacer,
  NavTitle,
  NavWrapper
} from '@style/Nav'
import Collapse from '@ui/layout/Collapse/Collapse'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import Bookmarks from './Bookmarks'
import SharedNotes from './SharedNotes'
import { useSidebarTransition } from './Transition'
import Tree from './Tree'
import { NavProps } from './Types'

const Nav = ({ links }: NavProps) => {
  // const match = useMatch(`/${ROUTE_PATHS.node}/:nodeid`)
  const initTree = useTreeFromLinks()
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const { getFocusProps } = useLayout()
  const { getLinkCount } = useLinks()
  const { goTo } = useRouting()
  const { createNewNode } = useCreateNewNode()

  const [source, target] = useSingleton()

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const nodeid = createNewNode()

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const onDoubleClickToogle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2) {
      toggleSidebar()

      if (window && window.getSelection) {
        const sel = window.getSelection()
        sel.removeAllRanges()
      }
    }
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
    <>
      <NavWrapper
        onMouseUp={(e) => onDoubleClickToogle(e)}
        style={springProps}
        expanded={sidebar.expanded}
        {...getFocusProps(focusMode)}
      >
        <NavTooltip singleton={source} />

        <NavLogoWrapper>
          <Logo />
        </NavLogoWrapper>

        <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
          <NavTooltip
            key={shortcuts.newNode.title}
            singleton={target}
            content={<TooltipTitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
          >
            <CreateNewButton onClick={onNewNote}>
              <Icon icon="fa6-solid:file-pen" />
              <NavTitle>Create New Note</NavTitle>
            </CreateNewButton>
          </NavTooltip>
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
          title="All Notes"
          oid={`tree`}
          defaultOpen
          stopPropagation
          icon={gitBranchLine}
          maximumHeight="80vh"
          infoProps={{
            text: TreeHelp
          }}
        >
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
            title="SharedNotes"
            oid="sharednotes"
            icon={shareLine}
            maximumHeight="30vh"
            infoProps={{
              text: SharedHelp
            }}
          >
            <SharedNotes />
          </Collapse>
          <Tree initTree={initTree} />
        </Collapse>

        <NavSpacer />
        <NavDivider />

        <EndLinkContainer onMouseUp={(e) => e.stopPropagation()}>
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
            <Link
              tabIndex={-1}
              className={(s) => (s.isActive ? 'active' : '')}
              to={ROUTE_PATHS.archive}
              key="nav_search"
            >
              {GetIcon(archiveFill)}
              <NavTitle>Archive</NavTitle>
              {archiveCount > 0 && <Count>{archiveCount}</Count>}
            </Link>
          </NavTooltip>
          {/*
        <NavButton onClick={toggleSidebar}>
          <Icon icon={sidebar.expanded ? menuFoldLine : menuUnfoldLine} />
          <NavTitle>{sidebar.expanded ? 'Collapse' : 'Expand'}</NavTitle>
        </NavButton>
         */}

          <NavTooltip
            key={shortcuts.showSettings.title}
            singleton={target}
            content={<TooltipTitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
          >
            <Link
              tabIndex={-1}
              className={(s) => (s.isActive ? 'active' : '')}
              to={`${ROUTE_PATHS.settings}`}
              key="nav_settings"
            >
              {GetIcon(settings4Line)}
              <NavTitle>Settings</NavTitle>
            </Link>
          </NavTooltip>
        </EndLinkContainer>
      </NavWrapper>
      <TrafficLightBG />
      <SidebarToggle />
    </>
  )
}

export default Nav
