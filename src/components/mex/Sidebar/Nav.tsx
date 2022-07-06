import { Logo, SidebarToggle, TrafficLightBG } from '@data/illustrations/logo'
import useNavlinks, { GetIcon } from '@data/links'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import useLayout from '@hooks/useLayout'
import { useKeyListener } from '@hooks/useShortcutListener'
import archiveFill from '@iconify/icons-ri/archive-fill'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { useSingleton } from '@tippyjs/react'
import React, { useEffect, useMemo, useState } from 'react'
import tinykeys from 'tinykeys'
import {
  ComingSoon,
  Count,
  CreateNewButton,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  NavLogoWrapper,
  NavTitle,
  NavWrapper
} from '@style/Nav'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import Bookmarks from './Bookmarks'
import SharedNotes from './SharedNotes'
import { useSidebarTransition } from './Transition'
import { TreeContainer } from './Tree'
import Tabs, { TabType } from '@components/layouts/Tabs'
import { MexIcon } from '@style/Layouts'
import { SharedNodeIcon } from '@components/icons/Icons'
import { useTheme } from 'styled-components'
import { PollActions, useApiStore } from '@store/useApiStore'
import { usePolling } from '@apis/usePolling'
import { getRandomQAContent } from '@data/Defaults/baseData'
import useDataStore from '@store/useDataStore'
import { useNavigation } from '@hooks/useNavigation'
import { SItem } from './SharedNotes.style'
import { ItemContent, ItemTitle } from '@style/Sidebar'

const CreateNewNote: React.FC<{ target: any }> = ({ target }) => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    createNoteWithQABlock()
  }

  const createNoteWithQABlock = () => {
    const qaContent = getRandomQAContent()
    const note = createNewNote({ noteContent: qaContent })

    goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
  }

  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, () => {
          createNoteWithQABlock()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
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
  )
}

const NavHeader: React.FC<{ target: any }> = ({ target }) => {
  const { getLinks } = useNavlinks()

  const links = useMemo(() => getLinks(), [])

  return (
    <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <CreateNewNote target={target} />
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
  )
}

const NavFooter: React.FC<{ target: any }> = ({ target }) => {
  const archive = useDataStore((store) => store.archive)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  return (
    <EndLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <NavTooltip
        key={shortcuts.showArchive.title}
        singleton={target}
        content={<TooltipTitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
      >
        <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.archive} key="nav_search">
          {GetIcon(archiveFill)}
          <NavTitle>Archive</NavTitle>
          {archive.length > 0 && <Count>{archive.length}</Count>}
        </Link>
      </NavTooltip>

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
  )
}

const TestNav = () => {
  const { push } = useNavigation()
  const { goTo } = useRouting()

  const onClick = (id: string) => {
    push(id)
    goTo(ROUTE_PATHS.node, NavigationType.push, id)
  }

  return (
    <div>
      {[
        { title: 'First', id: 'NODE_yeAL46g8VrykqYRqQWncy' },
        { title: 'Second', id: 'NODE_MQVEejyKKNnMpBbDiGeAr' }
      ].map((item) => (
        <SItem selected={false} key={`shared_notes_link_${item.id}`} onClick={() => onClick(item.id)}>
          <ItemContent>
            <ItemTitle>
              <SharedNodeIcon />
              <span>{item.title}</span>
            </ItemTitle>
          </ItemContent>
        </SItem>
      ))}
    </div>
  )
}

const NavBody: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [openedTab, setOpenedTab] = useState<PollActions>(PollActions.hierarchy)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)

  usePolling()
  const theme = useTheme()

  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon noHover icon="ri:draft-line" width={20} height={20} />,
        type: PollActions.hierarchy,
        component: <TreeContainer />,
        tooltip: 'All Notes'
      },
      {
        label: <SharedNodeIcon fill={theme.colors.text.default} height={18} width={18} />,
        component: <SharedNotes />,
        type: PollActions.shared,
        tooltip: 'Shared Notes'
      },
      {
        label: <MexIcon noHover icon="ri:bookmark-line" width={20} height={20} />,
        type: PollActions.bookmarks,
        component: <Bookmarks />,
        tooltip: 'Bookmarks'
      }
    ],
    [theme]
  )

  return (
    <Tabs
      visible={isVisible}
      openedTab={openedTab}
      onChange={(tab) => {
        setOpenedTab(tab)
        replaceAndAddActionToPoll(tab)
      }}
      tabs={tabs}
    />
  )
}

const Nav = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const { getFocusProps } = useLayout()

  const [source, target] = useSingleton()

  const onDoubleClickToogle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2) {
      toggleSidebar()

      if (window && window.getSelection) {
        const sel = window.getSelection()
        sel.removeAllRanges()
      }
    }
  }

  const { springProps } = useSidebarTransition()

  return (
    <>
      <NavWrapper
        onMouseUp={onDoubleClickToogle}
        style={springProps}
        expanded={sidebar.expanded}
        {...getFocusProps(focusMode)}
      >
        <NavTooltip singleton={source} />

        <NavLogoWrapper>
          <Logo />
        </NavLogoWrapper>

        <NavHeader target={target} />
        <NavBody isVisible={sidebar.expanded} />
        <NavFooter target={target} />
      </NavWrapper>
      <TrafficLightBG />
      <SidebarToggle />
    </>
  )
}

export default Nav
