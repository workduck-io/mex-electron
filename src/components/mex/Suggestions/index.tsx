import more2Fill from '@iconify-icons/ri/more-2-fill'
import React from 'react'
import IconButton from '../../../style/Buttons'
import messageIcon from '@iconify-icons/ri/message-3-line'
import { StyledSyncBlockInfo, GraphTools } from '../Graph/Graph.styles'
import { useHelpStore } from '../../../store/useHelpStore'
import useToggleElements from '../../../hooks/useToggleElements'
import { StyledBlockInfo } from '../../../editor/Components/SyncBlock/SyncBlockInfo'
import useSuggestionStore from '../../../store/useSuggestions'
import { defaultContent } from '../../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { Result, ResultHeader, ResultTitle } from '../../../style/Search'
import { useContentStore } from '../../../store/useContentStore'
import { useLinks } from '../../../hooks/useLinks'
import { usePlateEditorRef, insertNodes, TElement } from '@udecode/plate'
import { ELEMENT_ILINK } from '../../../editor/Components/ilink/defaults'
import { Margin } from '../../../style/Integration'

const SuggestionInfoBar = () => {
  const { showSuggestedNodes, toggleSuggestedNodes } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { suggestions } = useSuggestionStore()
  const contents = useContentStore((store) => store.contents)
  const { getNodeIdFromUid } = useLinks()
  const editor = usePlateEditorRef()

  const onClick = (path: string) => {
    insertNodes<TElement>(editor, {
      type: ELEMENT_ILINK as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      children: [{ text: '' }],
      value: path
    })
  }

  return (
    <StyledSyncBlockInfo>
      <GraphTools>
        <IconButton
          size={24}
          icon={messageIcon}
          shortcut={shortcuts.showSyncBlocks.keystrokes}
          title="Suggest Nodes"
          highlight={showSuggestedNodes}
          onClick={toggleSuggestedNodes}
        />
        <label htmlFor="flow-links">Suggestions</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </GraphTools>

      <StyledBlockInfo>
        {suggestions.map((suggestion) => {
          const con = contents[suggestion.nodeUID]
          const path = getNodeIdFromUid(suggestion.nodeUID)
          const content = con ? con.content : defaultContent.content

          return (
            <Margin key={`ResultForSearch_${suggestion.nodeUID}`} onClick={() => onClick(path)}>
              <Result>
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                </ResultHeader>
                <EditorPreviewRenderer content={content} editorId={`editor_${suggestion.nodeUID}`} />
              </Result>
            </Margin>
          )
        })}
      </StyledBlockInfo>
    </StyledSyncBlockInfo>
  )
}

export default SuggestionInfoBar
