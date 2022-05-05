import { selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect, useMemo } from 'react'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import Metadata from '../components/mex/Metadata/Metadata'
import { defaultContent } from '../data/Defaults/baseData'
import { useEditorBuffer } from '../hooks/useEditorBuffer'
import useLayout from '../hooks/useLayout'
import useLoad from '../hooks/useLoad'
import { useSearch } from '../hooks/useSearch'
import { useKeyListener } from '../hooks/useShortcutListener'
import { useAnalysisTodoAutoUpdate } from '../store/useAnalysis'
import useBlockStore from '../store/useBlockStore'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import useSuggestionStore from '../store/useSuggestions'
import { EditorWrapper, StyledEditor } from '../style/Editor'
import { getEditorId } from '../utils/lib/EditorId'
import { convertContentToRawText } from '../utils/search/parseData'
import BlockInfoBar from './Components/Blocks/BlockInfoBar'
import { BlockOptionsMenu } from './Components/EditorContextMenu'
import Editor from './Editor'
import Toolbar from './Toolbar'

import { removeStopwords } from '../utils/stopwords'
import { useComboboxOpen } from './Components/combobox/hooks/useComboboxOpen'
import { mog } from '../utils/lib/helper'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const setIsEditing = useEditorStore((store) => store.setIsEditing)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const headingQASearch = useSuggestionStore((store) => store.headingQASearch)

  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const isComboOpen = useComboboxOpen()

  const { queryIndexWithRanking } = useSearch()

  const infobar = useLayoutStore((store) => store.infobar)

  const { node, fsContent } = useEditorStore(
    (state) => ({ nodeid: state.node.nodeid, node: state.node, fsContent: state.content }),
    shallow
  )

  const { shortcutHandler } = useKeyListener()
  const { setSuggestions } = useSuggestionStore()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const editorRef = usePlateEditorRef()

  const { addOrUpdateValBuffer, getBufferVal } = useEditorBuffer()

  const getSuggestions = async (val: any[]) => {
    if (infobar.mode === 'suggestions' && !headingQASearch) {
      const cursorPosition = editorRef?.selection?.anchor?.path?.[0]
      const lastTwoParagraphs = cursorPosition > 2 ? cursorPosition - 2 : 0
      const rawText = convertContentToRawText(val.slice(lastTwoParagraphs, cursorPosition + 1), ' ')
      const keywords = removeStopwords(rawText)

      const results = await queryIndexWithRanking(['node', 'snippet'], keywords.join(' '))
      mog('suggestions', { val, results })

      const withoutCurrentNode = results.filter((item) => item.id !== node.nodeid)

      const suggestions = withoutCurrentNode.map((item) => ({
        ...item,
        type: item.id.startsWith('SNIPPET_') ? 'snippet' : 'node'
      }))

      setSuggestions(suggestions)
    }
  }

  const onChangeSave = async (val: any[]) => {
    if (val && node && node.nodeid !== '__null__') {
      mog('change')
      setIsEditing(false)
      addOrUpdateValBuffer(node.nodeid, val)
    }
  }

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  useAnalysisTodoAutoUpdate()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
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
          saveApiAndUpdate(node, val)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const readOnly = !!fetchingContent

  return (
    <>
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        <Toolbar />

        {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

        <EditorWrapper onClick={onFocusClick} comboboxOpen={isComboOpen}>
          <Editor
            getSuggestions={getSuggestions}
            showBalloonToolbar
            content={fsContent?.content ?? defaultContent.content}
            onChange={onChangeSave}
            editorId={editorId}
          />
        </EditorWrapper>
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
