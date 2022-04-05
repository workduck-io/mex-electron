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
import { InfobarFull, InfobarTools } from '../../../style/infobar'
import { Result, ResultHeader, ResultTitle } from '../../../style/Search'
import pushpin2Line from '@iconify/icons-ri/pushpin-2-line'
import { View } from '../Search/ViewSelector'

const Margin = styled.div`
  margin: 1rem 1rem 0;
`

const SuggestionInfoBar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleSuggestedNodes } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { suggestions, pinSuggestion, pinnedSuggestions } = useSuggestionStore()
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
    <InfobarFull>
      <InfobarTools>
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Smart Suggestions"
          highlight={infobar.mode === 'suggestions'}
          onClick={toggleSuggestedNodes}
        />
        <label htmlFor="flow-links">Smart Suggestions</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </InfobarTools>

      <>
        {pinnedSuggestions.map((suggestion) => {
          const con = contents[suggestion.id]
          const path = getPathFromNodeid(suggestion.id)
          const content = con ? con.content : defaultContent.content

          return (
            <Margin key={`ResultForSearch_${suggestion.id}_pinned`} onClick={() => onClick(suggestion.id)}>
              <Result selected={suggestion.pinned}>
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                  <IconButton
                    highlight={suggestion.pinned}
                    onClick={(ev) => {
                      ev.stopPropagation()
                      pinSuggestion(suggestion)
                    }}
                    icon={pushpin2Line}
                    title="Pin suggestion"
                  />
                </ResultHeader>
                <EditorPreviewRenderer content={content} editorId={`editor_${suggestion.id}_pinned`} />
              </Result>
            </Margin>
          )
        })}
      </>

      <>
        {suggestions.map((suggestion) => {
          const con = contents[suggestion.id]
          const path = getPathFromNodeid(suggestion.id)
          const content = con ? con.content : defaultContent.content

          return (
            <Margin key={`ResultForSearch_${suggestion.id}`} onClick={() => onClick(suggestion.id)}>
              <Result selected={suggestion.pinned}>
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                  <IconButton
                    onClick={(ev) => {
                      ev.stopPropagation()
                      pinSuggestion(suggestion)
                    }}
                    icon={pushpin2Line}
                    title="Pin suggestion"
                  />
                </ResultHeader>
                <EditorPreviewRenderer content={content} editorId={`editor_${suggestion.id}`} />
              </Result>
            </Margin>
          )
        })}
      </>
    </InfobarFull>
  )
}

export default SuggestionInfoBar
