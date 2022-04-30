import React, { useMemo } from 'react'
import searchLine from '@iconify/icons-ri/search-line'
import { ToolbarTooltip } from '../Tooltips'
import {
  NavigationButton,
  VerticalSeparator,
  SearchBar,
  UserIcon,
  CreateNewButton,
  NavigationButtons,
  TitlebarControls,
  TitlebarWrapper
} from './style'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon } from '@iconify/react'
import { ProfileImage } from '../User/ProfileImage'
import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../../data/IpcAction'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { useLocation } from 'react-router-dom'
import { mog } from '../../../utils/lib/helper'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { useNewNote } from '../../../hooks/useNewNote'
import useLayout from '../../../hooks/useLayout'

const Titlebar = () => {
  const { getUserDetails } = useAuth()
  const userDetails = getUserDetails()
  const location = useLocation()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const { createNewNote } = useNewNote()
  const { getFocusProps } = useLayout()

  const { canGoBack, canGoForward } = useMemo(() => {
    const hist = window.history
    const res = {
      canGoBack: hist.length > 1 && hist.state !== null && hist.state.idx > 0,
      canGoForward: hist.length > 1 && hist.state !== null && hist.state.idx < hist.length - 1
    }
    return res
  }, [location])

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const nodeid = createNewNote()
  }

  const onBack = () => {
    ipcRenderer.send(IpcAction.GO_BACK)
  }

  const onForward = () => {
    ipcRenderer.send(IpcAction.GO_FORWARD)
  }

  return (
      <TitlebarWrapper

        {...getFocusProps(focusMode)}
      >
      <TitlebarControls>
        <NavigationButtons>
          <ToolbarTooltip
            content={<TooltipTitleWithShortcut title="Navigate Backward" shortcut={shortcuts.gotoForward.keystrokes} />}
          >
            <NavigationButton disabled={!canGoBack} onClick={onBack}>
              <Icon icon={arrowLeftSLine} />
            </NavigationButton>
          </ToolbarTooltip>
          <ToolbarTooltip
            content={<TooltipTitleWithShortcut title="Navigate Forward" shortcut={shortcuts.gotoForward.keystrokes} />}
          >
            <NavigationButton disabled={!canGoForward} onClick={onForward}>
              <Icon icon={arrowRightSLine} />
            </NavigationButton>
          </ToolbarTooltip>
        </NavigationButtons>
        <VerticalSeparator />

        <ToolbarTooltip
          key={shortcuts.newNode.title}
          content={<TooltipTitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
        >
          <CreateNewButton onClick={onNewNote}>
            <Icon icon="fa6-solid:file-pen" />
          </CreateNewButton>
        </ToolbarTooltip>
      </TitlebarControls>
      <SearchBar>
        <Icon icon={searchLine} />
        <input disabled type="text" placeholder="Search by the Keywords" />
      </SearchBar>
      <UserIcon>
        <ProfileImage email={userDetails?.email} size={28} />
      </UserIcon>
    </TitlebarWrapper>
  )
}

export default Titlebar
