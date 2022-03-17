import lightbulbFlashLine from '@iconify/icons-ri/lightbulb-flash-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import React from 'react'
import styled from 'styled-components'
import { useReminders } from '../../../hooks/useReminders'
import useToggleElements from '../../../hooks/useToggleElements'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import IconButton, { Button } from '../../../style/Buttons'
import { InfobarTools } from '../../../style/infobar'
import { Result, ResultHeader, ResultTitle } from '../../../style/Search'
import { Title } from '../../../style/Typography'
import { StyledGraph } from '../Graph/Graph.styles'
import { useCreateReminderModal } from './CreateReminderModal'
import { Reminder, RemindersWrapper } from './Reminders.style'

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
  const toggleModal = useCreateReminderModal((state) => state.toggleModal)

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
      <InfobarTools>
        <IconButton
          size={24}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <label htmlFor="reminders">Reminders</label>
        <IconButton size={24} icon={more2Fill} onClick={toggleModal} title="Options" />
      </InfobarTools>

      <RemindersWrapper>
        <Reminder>
          <Title>Create Reminder</Title>

          <Button large primary onClick={toggleModal}>
            Create Reminder
          </Button>
        </Reminder>
        {reminders.map((reminder) => {
          // const con = contents[suggestion.id]
          // const path = getPathFromNodeid(suggestion.id)
          // const content = con ? con.content : defaultContent.content
          // mog('SuggestionInfoBar', { content, con, path, suggestion })

          return (
            <Reminder key={`ResultForSearch_${reminder.id}`}>
              <Title>{reminder.title}</Title>
              {reminder.description}
              {reminder.time}
            </Reminder>
          )
        })}
        {reminders.length === 0 && (
          <Reminder>
            <ResultHeader>
              <ResultTitle>No reminders</ResultTitle>
            </ResultHeader>
            <p>
              You can add reminders by clicking the <strong>Create</strong> button in the toolbar.
            </p>
          </Reminder>
        )}
      </RemindersWrapper>
    </StyledGraph>
  )
}

export default RemindersInfobar
