import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import React from 'react'
import styled from 'styled-components'
import { useReminders } from '../../../hooks/useReminders'
import useToggleElements from '../../../hooks/useToggleElements'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import IconButton from '../../../style/Buttons'
import { Result, ResultHeader, ResultTitle } from '../../../style/Search'
import { GraphTools, StyledGraph } from '../Graph/Graph.styles'

const Margin = styled.div`
  margin: 1rem 1rem 0;
`

const RemindersInfobar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleReminder } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { getNodeReminders } = useReminders()
  // const contents = useContentStore((store) => store.contents)
  // const { getPathFromNodeid } = useLinks()
  const nodeid = useEditorStore((store) => store.node.nodeid)

  // const onClick = (id: string) => {
  //   insertNodes<TElement>(editor, {
  //     type: ELEMENT_ILINK as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  //     children: [{ text: '' }],
  //     value: id
  //   })
  // }

  const reminders = getNodeReminders(nodeid)
  return (
    <StyledGraph>
      <GraphTools>
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <label htmlFor="reminders">Reminders</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </GraphTools>

      <>
        {reminders.map((reminder) => {
          // const con = contents[suggestion.id]
          // const path = getPathFromNodeid(suggestion.id)
          // const content = con ? con.content : defaultContent.content
          // mog('SuggestionInfoBar', { content, con, path, suggestion })

          return (
            <Margin key={`ResultForSearch_${reminder.id}`}>
              <Result>
                <ResultHeader>
                  <ResultTitle>{reminder.title}</ResultTitle>
                </ResultHeader>
                {reminder.description}
                {reminder.time}
              </Result>
            </Margin>
          )
        })}
      </>
    </StyledGraph>
  )
}

export default RemindersInfobar
