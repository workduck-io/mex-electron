import { SharedNodeIcon } from '@components/icons/Icons'
import WDLogo from '@components/spotlight/Search/Logo'
import { getRandomQAContent } from '@data/Defaults/baseData'
import { SidebarToggle, TrafficLightBG } from '@data/illustrations/logo'
import useNavlinks, { GetIcon } from '@data/links'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import useLayout from '@hooks/useLayout'
import { useNavigation } from '@hooks/useNavigation'
import { useKeyListener } from '@hooks/useShortcutListener'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveFill from '@iconify/icons-ri/archive-fill'
import searchLine from '@iconify/icons-ri/search-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import useDataStore from '@store/useDataStore'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import {
  ComingSoon,
  Count,
  CreateNewButton,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  MainNav,
  NavLogoWrapper,
  NavTitle,
  NavWrapper,
  SearchLink,
  SideNav
} from '@style/Nav'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import { useSingleton } from '@tippyjs/react'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavTooltip } from '../Tooltips'
import { SItem } from './SharedNotes.style'
import SidebarTabs from './SidebarTabs'
import { useSidebarTransition } from './Transition'

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
        <Icon icon={addCircleLine} />
      </CreateNewButton>
    </NavTooltip>
  )
}

const NavHeader: React.FC<{ target: any }> = ({ target }) => {
  const { getLinks } = useNavlinks()

  const links = getLinks()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  return (
    <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <CreateNewNote target={target} />
      <NavTooltip
        key={ROUTE_PATHS.search}
        singleton={target}
        content={<TooltipTitleWithShortcut title="Search" shortcut={shortcuts.showSearch.keystrokes} />}
      >
        <SearchLink
          tabIndex={-1}
          className={(s) => (s.isActive ? 'active' : '')}
          to={ROUTE_PATHS.search}
          key={`nav_search`}
        >
          {GetIcon(searchLine)}
        </SearchLink>
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

// const NavBody: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
//   const [openedTab, setOpenedTab] = useState<SingleTabType>(SidebarTab.hierarchy)
//   const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)

//   usePolling()
//   const theme = useTheme()

//   return (
//     <Tabs
//       visible={isVisible}
//       openedTab={openedTab}
//       onChange={(tab) => {
//         setOpenedTab(tab)
//         replaceAndAddActionToPoll(tab as PollActions)
//       }}
//       tabs={tabs}
//     />
//   )
// }

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
        onMouseUp={(e) => onDoubleClickToogle(e)}
        expanded={sidebar.expanded}
        show={sidebar.show}
        {...getFocusProps(focusMode)}
      >
        <MainNav {...getFocusProps(focusMode)}>
          <NavTooltip singleton={source} />

          <NavLogoWrapper>
            <WDLogo height={'64'} width={'64'} />
          </NavLogoWrapper>
          <NavHeader target={target} />
          <NavFooter target={target} />
        </MainNav>
        <SideNav style={springProps} expanded={sidebar.expanded} show={sidebar.show} {...getFocusProps(focusMode)}>
          {/* Notes, Shared, Bookmarks */}
          <SidebarTabs />
        </SideNav>
      </NavWrapper>
      <TrafficLightBG />
      <SidebarToggle />
    </>
  )
}

export default Nav
