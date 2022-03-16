import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import { insertNodes, TElement, usePlateEditorRef } from '@udecode/plate'
import React from 'react'
import styled from 'styled-components'
import { defaultContent } from '../../../data/Defaults/baseData'
import { ELEMENT_ILINK } from '../../../editor/Components/ilink/defaults'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useLinks } from '../../../hooks/useLinks'
import useToggleElements from '../../../hooks/useToggleElements'
import { useContentStore } from '../../../store/useContentStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import useSuggestionStore from '../../../store/useSuggestions'
import IconButton from '../../../style/Buttons'
import { Result, ResultHeader, ResultTitle } from '../../../style/Search'
import { mog } from '../../../utils/lib/helper'
import { GraphTools, StyledGraph } from '../Graph/Graph.styles'

const Margin = styled.div`
  margin: 1rem 1rem 0;
`

const SuggestionInfoBar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleSuggestedNodes } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { suggestions } = useSuggestionStore()
  const contents = useContentStore((store) => store.contents)
  const { getPathFromNodeid } = useLinks()
  const editor = usePlateEditorRef()

  const onClick = (id: string) => {
    insertNodes<TElement>(editor, {
      type: ELEMENT_ILINK as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      children: [{ text: '' }],
      value: id
    })
  }

  return (
    <StyledGraph>
      <GraphTools>
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Suggestions"
          highlight={infobar.mode === 'suggestions'}
          onClick={toggleSuggestedNodes}
        />
        <label htmlFor="flow-links">Suggestions</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </GraphTools>

      <>
        {suggestions.map((suggestion) => {
          const con = contents[suggestion.id]
          const path = getPathFromNodeid(suggestion.id)
          const content = con ? con.content : defaultContent.content
          // mog('SuggestionInfoBar', { content, con, path, suggestion })

          return (
            <Margin key={`ResultForSearch_${suggestion.id}`} onClick={() => onClick(suggestion.id)}>
              <Result>
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                </ResultHeader>
                <EditorPreviewRenderer content={content} editorId={`editor_${suggestion.id}`} />
              </Result>
            </Margin>
          )
        })}
      </>
    </StyledGraph>
  )
}

export default SuggestionInfoBar
