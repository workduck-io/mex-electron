import { usePlateEditorRef } from '@udecode/plate'
import React, { useEffect, useMemo } from 'react'
import { convertContentToRawText } from '../utils/search/localSearch'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import Metadata from '../components/mex/Metadata/Metadata'
import NodeIntentsModal from '../components/mex/NodeIntentsModal/NodeIntentsModal'
import { defaultContent } from '../data/Defaults/baseData'
import { useEditorBuffer } from '../hooks/useEditorBuffer'
import useLayout from '../hooks/useLayout'
import useLoad from '../hooks/useLoad'
import { useNavigation } from '../hooks/useNavigation'
import { useKeyListener } from '../hooks/useShortcutListener'
import { useNewSearchStore } from '../store/useSearchStore'
// import { useQStore } from '../store/useQStore'
import useToggleElements from '../hooks/useToggleElements'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { StyledEditor } from '../style/Editor'
import useSuggestionStore from '../store/useSuggestions'
import { getEditorId } from '../utils/lib/EditorId'
import { mog } from '../utils/lib/helper'
import sw from 'stopword'

import { NavigationType, ROUTE_PATHS, useRouting } from '../views/routes/urls'
// import { NodeContent } from '../types/data'
// import { useDataSaverFromContent } from './Components/Saver'

import Editor from './Editor'
import Toolbar from './Toolbar'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()

  const { showGraph, showSuggestedNodes } = useToggleElements()
  const searchIndex = useNewSearchStore((store) => store.searchIndex)
  const { goTo } = useRouting()

  const { nodeid, node, fsContent } = useEditorStore(
    (state) => ({ nodeid: state.node.nodeid, node: state.node, fsContent: state.content }),
    shallow
  )

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()
  const { setSuggestions } = useSuggestionStore()

  const { move } = useNavigation()

  // const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  // const add2Q = useQStore((s) => s.add2Q)

  const editorRef = usePlateEditorRef()

  const { addOrUpdateValBuffer, getBufferVal } = useEditorBuffer()

  const onChangeSave = (val: any[]) => {
    // mog('Trigger onChange', { node, val })
    if (val && node && node.nodeid !== '__null__') {
      // mog('Saving onChange', { node, val })

      if (showSuggestedNodes) {
        const cursorPosition = editorRef?.selection?.anchor?.path?.[0]

        const lastTwoParagraphs = cursorPosition > 2 ? cursorPosition - 2 : 0
        const rawText = convertContentToRawText(val.slice(lastTwoParagraphs, cursorPosition + 1), ' ')

        const keywords = sw.removeStopwords(rawText.split(' ').filter(Boolean))

        mog('keywords', { keywords })
        const results = searchIndex(keywords.join(' '))

        const withoutCurrentNode = results.filter((item) => item.nodeUID !== node.nodeid)

        setSuggestions(withoutCurrentNode)
      }

      // add2Q(node.nodeid)
      addOrUpdateValBuffer(node.nodeid, val)
      // saveEditorValueAndUpdateStores(node, val, false)
    }
  }

  const editorId = useMemo(
    () =>
      getEditorId(
        node.nodeid,
        // fsContent.metadata?.updatedAt?.toString() ?? 'not_updated',
        false
      ),
    [node, fetchingContent]
  )

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.gotoBackwards.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoBackwards, () => {
          move(-1)
        })
      },
      [shortcuts.gotoForward.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoForward, () => {
          move(+1)
        })
      },
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.nodeid)
          mog('Buffer value for node', { node, val })
          saveApiAndUpdate(node, val)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <Toolbar />

        <Metadata />

        <Editor
          showBalloonToolbar
          readOnly={fetchingContent}
          content={fsContent?.content ?? defaultContent.content}
          onChange={onChangeSave}
          editorId={editorId}
        />
      </StyledEditor>
      <NodeIntentsModal nodeid={nodeid} />
    </>
  )
}

export default ContentEditor
