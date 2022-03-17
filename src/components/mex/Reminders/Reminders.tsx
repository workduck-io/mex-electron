import addCircleLine from '@iconify/icons-ri/add-circle-line'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import timerLine from '@iconify/icons-ri/timer-line'
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useReminders, useReminderStore } from '../../../hooks/useReminders'
import useToggleElements from '../../../hooks/useToggleElements'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import IconButton, { Button } from '../../../style/Buttons'
import { InfobarFull, InfobarTools } from '../../../style/infobar'
import { Description, Title } from '../../../style/Typography'
import { getRelativeDate, toLocaleString } from '../../../utils/time'
import { RelativeTime } from '../RelativeTime'
import { useCreateReminderModal } from './CreateReminderModal'
import {
  Reminder,
  ReminderExact,
  ReminderGroup,
  ReminderInfobar,
  ReminderRelative,
  RemindersWrapper,
  ReminderTime
} from './Reminders.style'

const RemindersInfobar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleReminder } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const remindersAll = useReminderStore((store) => store.reminders)
  const { getNodeReminders, clearNodeReminders } = useReminders()
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

  const reminderGroups = useMemo(() => {
    const nodeReminders = getNodeReminders(nodeid)
    return nodeReminders
  }, [remindersAll, nodeid])

  return (
    <InfobarFull>
      <InfobarTools>
        <IconButton
          size={24}
          icon={timerFlashLine}
          shortcut={shortcuts.showReminder.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <label htmlFor="reminders">Reminders</label>
        <IconButton
          size={24}
          icon={deleteBin6Line}
          onClick={() => clearNodeReminders(nodeid)}
          title="Delete All Reminders"
        />
        <IconButton size={24} icon={more2Fill} onClick={toggleModal} title="Options" />
      </InfobarTools>

      <ReminderInfobar>
        <Title>Reminders</Title>
        <Button large primary onClick={() => toggleModal()}>
          <Icon icon={addCircleLine} />
          Create Reminder
        </Button>
        {reminderGroups.map(
          (
            reminderGroup // const con = contents[suggestion.id]
          ) => (
            // const path = getPathFromNodeid(suggestion.id)
            // const content = con ? con.content : defaultContent.content
            // mog('SuggestionInfoBar', { content, con, path, suggestion })
            <ReminderGroup key={`ReminderGroup_${nodeid}_${reminderGroup.type}`}>
              <Title>{reminderGroup.label}</Title>
              <RemindersWrapper>
                {reminderGroup.reminders.map((reminder) => (
                  <Reminder key={`ReultForSearch_${reminder.id}`}>
                    <ReminderTime>
                      <ReminderRelative>
                        <Icon icon={timerLine} />
                        <RelativeTime
                          tippy
                          dateNum={reminder.time}
                          refreshMs={1000 * 30}
                          tippyProps={{ placement: 'right', theme: 'mex-bright' }}
                        />
                      </ReminderRelative>
                      <ReminderExact>{getRelativeDate(new Date(reminder.time))}</ReminderExact>
                    </ReminderTime>
                    <Title>{reminder.title}</Title>
                    <Description>{reminder.description}</Description>
                  </Reminder>
                ))}
              </RemindersWrapper>
            </ReminderGroup>
          )
        )}
      </ReminderInfobar>
    </InfobarFull>
  )
}

export default RemindersInfobar
