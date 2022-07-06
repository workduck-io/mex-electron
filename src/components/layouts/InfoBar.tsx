import { MexIcon } from '@style/Layouts'
import React, { useEffect, useMemo, useState } from 'react'
import tinykeys from 'tinykeys'
import SyncBlockInfo from '../../editor/Components/SyncBlock/SyncBlockInfo'
import { useGraphData } from '../../hooks/useGraphData'
import useLayout from '../../hooks/useLayout'
import { useKeyListener } from '../../hooks/useShortcutListener'
import useToggleElements from '../../hooks/useToggleElements'
import { useHelpStore } from '../../store/useHelpStore'
import { InfobarMode, useLayoutStore } from '../../store/useLayoutStore'
import useSuggestionStore from '../../store/useSuggestionStore'
import { InfoBarWrapper } from '../../style/infobar'
import Graph from '../mex/Graph/Graph'
import RemindersInfobar from '../mex/Reminders/Reminders'
import DataInfoBar from '../mex/Sidebar/DataInfoBar'
import SuggestionInfoBar from '../mex/Suggestions'
import Tabs, { TabType } from './Tabs'

const InfoBarItems = () => {
  const graphData = useGraphData()
  const infobar = useLayoutStore((s) => s.infobar)
  const setInfobarMode = useLayoutStore((s) => s.setInfobarMode)

  // Ensure the tabs have InfobarType in type
  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: 'default',
        component: <DataInfoBar />,
        tooltip: 'Context'
      },
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: 'graph',
        component: <Graph graphData={graphData} />,
        tooltip: 'Graph'
      },
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: 'flow',
        component: <SyncBlockInfo />,
        tooltip: 'Flow'
      },
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: 'suggestions',
        component: <SuggestionInfoBar />,
        tooltip: 'Suggestions'
      },
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: 'reminders',
        component: <RemindersInfobar />,
        tooltip: 'Reminders'
      }
    ],
    [graphData]
  )

  return (
    <Tabs
      visible={true}
      openedTab={infobar.mode}
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
  const { toggleGraph, toggleSuggestedNodes, toggleReminder } = useToggleElements()
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
          toggleSuggestedNodes()
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
