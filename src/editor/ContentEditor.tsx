import { usePlateEditorRef } from '@udecode/plate'
import React, { useEffect, useMemo } from 'react'
import sw from 'stopword'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import Metadata from '../components/mex/Metadata/Metadata'
import { defaultContent } from '../data/Defaults/baseData'
import { useEditorBuffer } from '../hooks/useEditorBuffer'
import useLayout from '../hooks/useLayout'
import useLoad from '../hooks/useLoad'
import { useNavigation } from '../hooks/useNavigation'
import { useSearch } from '../hooks/useSearch'
import { useKeyListener } from '../hooks/useShortcutListener'
import useBlockStore from '../store/useBlockStore'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import useSuggestionStore from '../store/useSuggestions'
import { StyledEditor } from '../style/Editor'
import { getEditorId } from '../utils/lib/EditorId'
import { mog } from '../utils/lib/helper'
import { convertContentToRawText } from '../utils/search/parseData'
import BlockInfoBar from './Components/Blocks/BlockInfoBar'
import { BlockOptionsMenu } from './Components/EditorContextMenu'
import Editor from './Editor'
import Toolbar from './Toolbar'


const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()

  const isBlockMode = useBlockStore((store) => store.isBlockMode)

  const { queryIndex } = useSearch()

  const infobar = useLayoutStore((store) => store.infobar)

  const { nodeid, node, fsContent } = useEditorStore(
    (state) => ({ nodeid: state.node.nodeid, node: state.node, fsContent: state.content }),
    shallow
  )

  const { shortcutHandler } = useKeyListener()
  const { setSuggestions } = useSuggestionStore()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const { move } = useNavigation()

  const editorRef = usePlateEditorRef()

  const { addOrUpdateValBuffer, getBufferVal } = useEditorBuffer()

  const onChangeSave = async (val: any[]) => {
    if (val && node && node.nodeid !== '__null__') {
      if (infobar.mode === 'suggestions') {
        const cursorPosition = editorRef?.selection?.anchor?.path?.[0]

        const lastTwoParagraphs = cursorPosition > 2 ? cursorPosition - 2 : 0
        const rawText = convertContentToRawText(val.slice(lastTwoParagraphs, cursorPosition + 1), ' ')

        const keywords = sw.removeStopwords(rawText.split(' ').filter(Boolean))

        const results = await queryIndex('node', keywords.join(' '))

        const withoutCurrentNode = results.filter((item) => item.id !== node.nodeid)

        setSuggestions(withoutCurrentNode)
      }

      addOrUpdateValBuffer(node.nodeid, val)
    }
  }

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])

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
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        <Toolbar />

        {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

        <Editor
          showBalloonToolbar
          // readOnly={fetchingContent}
          content={fsContent?.content ?? defaultContent.content}
          onChange={onChangeSave}
          editorId={editorId}
        />
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
