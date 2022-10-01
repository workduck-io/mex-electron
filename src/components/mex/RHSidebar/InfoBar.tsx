import { MexIcon } from '@style/Layouts'
import React, { useEffect, useMemo, useState } from 'react'
import { tinykeys } from '@workduck-io/tinykeys'
import { useGraphData } from '@hooks/useGraphData'
import useLayout from '@hooks/useLayout'
import { useKeyListener } from '@hooks/useShortcutListener'
import useToggleElements from '@hooks/useToggleElements'
import { useHelpStore } from '@store/useHelpStore'
import { InfobarMode, useLayoutStore } from '@store/useLayoutStore'
import useSuggestionStore from '@store/useSuggestionStore'
import { InfoBarWrapper } from '@style/infobar'
import Graph from '@components/mex/Graph/Graph'
import RemindersInfobar from '@components/mex/Reminders/Reminders'
import DataInfoBar from '@components/mex/Sidebar/DataInfoBar'
import SuggestionInfoBar from '@components/mex/Suggestions'
import Tabs, { TabType } from '@components/layouts/Tabs'
import bubbleChartLine from '@iconify/icons-ri/bubble-chart-line'
import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { useShortcutStore } from '@store/useShortcutStore'
import SnippetSidebar from '../Sidebar/SnippetSidebar'

const InfoBarItems = () => {
  const graphData = useGraphData()
  const infobar = useLayoutStore((s) => s.infobar)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const setInfobarMode = useLayoutStore((s) => s.setInfobarMode)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // Ensure the tabs have InfobarType in type
  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon noHover icon="fluent:content-view-gallery-24-regular" width={24} height={24} />,
        type: 'default',
        component: <DataInfoBar wrapRef={wrapperRef} />,
        tooltip: 'Context'
      },
      {
        label: <MexIcon noHover icon={quillPenLine} width={24} height={24} />,
        type: 'snippets',
        component: <SnippetSidebar />,
        tooltip: 'Snippets'
        // shortcut: shortcuts.showSuggestedNodes.keystrokes
      },
      {
        label: <MexIcon noHover icon={timerFlashLine} width={24} height={24} />,
        type: 'reminders',
        component: <RemindersInfobar />,
        tooltip: 'Reminders'
      },
      {
        label: <MexIcon noHover icon={bubbleChartLine} width={24} height={24} />,
        type: 'graph',
        component: <Graph graphData={graphData} />,
        tooltip: 'Graph',
        shortcut: shortcuts.showGraph.keystrokes
      }
    ],
    [graphData]
  )

  return (
    <Tabs
      visible={true}
      openedTab={infobar.mode}
      wrapperRef={wrapperRef}
      onChange={(tab) => {
        setInfobarMode(tab as InfobarMode)
      }}
      tabs={tabs}
    />
  )
}

const InfoBar = () => {
  const focusMode = useLayoutStore((s) => s.focusMode)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { getFocusProps } = useLayout()

  const infobar = useLayoutStore((s) => s.infobar)
  const pinnedSuggestions = useSuggestionStore((s) => s.pinnedSuggestions)
  const { toggleGraph, toggleSnippets, toggleReminder } = useToggleElements()
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showGraph.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showGraph, () => {
          toggleGraph()
        })
      },
      // [shortcuts.showSyncBlocks.keystrokes]: (event) => {
      //   event.preventDefault()
      //   shortcutHandler(shortcuts.showSyncBlocks, () => {
      //     toggleSyncBlocks()
      //   })
      // },
      [shortcuts.showSuggestedNodes.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSuggestedNodes, () => {
          toggleSnippets()
        })
      },
      [shortcuts.showReminder.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showReminder, () => {
          toggleReminder()
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <InfoBarWrapper
      hasPinnedSuggestions={pinnedSuggestions.length > 0}
      mode={infobar.mode}
      {...getFocusProps(focusMode)}
    >
      <InfoBarItems />
    </InfoBarWrapper>
  )
}

export default InfoBar
