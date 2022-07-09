import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useHelpStore } from '@store/useHelpStore'
import { ipcRenderer } from 'electron'
import { IpcAction } from '@data/IpcAction'
import { NavTooltip } from '../Tooltips'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { NavigationButton, NavigationClusterWrapper } from '@style/Sidebar'
import { Icon } from '@iconify/react'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'

const NavigationCluster = () => {
  const location = useLocation()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const { canGoBack, canGoForward } = useMemo(() => {
    const hist = window.history
    const res = {
      canGoBack: hist.length > 1 && hist.state !== null && hist.state.idx > 0,
      canGoForward: hist.length > 1 && hist.state !== null && hist.state.idx < hist.length - 1
    }
    return res
  }, [location])

  const onBack = () => {
    ipcRenderer.send(IpcAction.GO_BACK)
  }

  const onForward = () => {
    ipcRenderer.send(IpcAction.GO_FORWARD)
  }

  return (
    <NavigationClusterWrapper>
      <NavTooltip
        placement="top-start"
        content={<TooltipTitleWithShortcut title="Backward" shortcut={shortcuts.gotoForward.keystrokes} />}
      >
        <NavigationButton disabled={!canGoBack} onClick={onBack}>
          <Icon icon={arrowLeftSLine} width={20} />
        </NavigationButton>
      </NavTooltip>
      <NavTooltip
        placement="top-start"
        content={<TooltipTitleWithShortcut title="Forward" shortcut={shortcuts.gotoForward.keystrokes} />}
      >
        <NavigationButton disabled={!canGoForward} onClick={onForward}>
          <Icon icon={arrowRightSLine} width={20} />
        </NavigationButton>
      </NavTooltip>
    </NavigationClusterWrapper>
  )
}

export default NavigationCluster
