import addCircleLine from '@iconify/icons-ri/add-circle-line'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import { Icon } from '@iconify/react'
import { flatten } from 'lodash'
import React, { useMemo } from 'react'
import { useReminders, useReminderStore } from '../../../hooks/useReminders'
import useToggleElements from '../../../hooks/useToggleElements'
import { getReminderState } from '../../../services/reminders/reminders'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import IconButton, { Button } from '../../../style/Buttons'
import { InfobarFull, InfobarTools } from '../../../style/infobar'
import { Title } from '../../../style/Typography'
import { Reminder } from '../../../types/reminders'
import { mog } from '../../../utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { useCreateReminderModal } from './CreateReminderModal'
import ReminderUI, { ReminderControls, SnoozeControl } from './Reminder'
import { ReminderGroupWrapper, ReminderInfobar, RemindersWrapper } from './Reminders.style'

const RemindersInfobar = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleReminder } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const remindersAll = useReminderStore((store) => store.reminders)
  const armedReminders = useReminderStore((store) => store.armedReminders)
  const { getNodeReminders, clearNodeReminders, actOnReminder, markUndone } = useReminders()
  // const contents = useContentStore((store) => store.contents)
  // const { getPathFromNodeid } = useLinks()
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const toggleModal = useCreateReminderModal((state) => state.toggleModal)

  const { goTo } = useRouting()

  // const onClick = (id: string) => {
  //   insertNodes<TElement>(editor, {
  //     type: ELEMENT_ILINK as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  //     children: [{ text: '' }],
  //     value: id
  //   })
  // }
  //
  const snoozeControl: SnoozeControl = {
    type: 'snooze',
    action: (reminder: Reminder, time: number) => {
      actOnReminder('snooze', reminder, time)
    }
  }
  const pastControls: ReminderControls = [
    {
      type: 'delete',
      action: (reminder: Reminder) => {
        actOnReminder('delete', reminder)
      }
    },
    snoozeControl
  ]
  const futureControls: ReminderControls = [
    ...pastControls,
    {
      type: 'unarchive',
      action: (reminder: Reminder) => {
        markUndone(reminder)
      }
    }
  ]
  const activeOrSnoozedControls: ReminderControls = [
    {
      type: 'open',
      action: (reminder: Reminder) => {
        actOnReminder('open', reminder)
      }
    },
    snoozeControl,
    {
      type: 'dismiss',
      action: (reminder: Reminder) => {
        actOnReminder('dismiss', reminder)
      }
    }
  ]

  const reminderGroups = useMemo(() => {
    mog('RemindersInfobar', { reminderGroups, remindersAll })
    const nodeReminders = getNodeReminders(nodeid)
    return nodeReminders
  }, [remindersAll, nodeid, armedReminders])

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
        <IconButton
          size={24}
          icon={more2Fill}
          onClick={() => {
            goTo(ROUTE_PATHS.reminders, NavigationType.push)
          }}
          title="All Reminders"
        />
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
            <ReminderGroupWrapper key={`ReminderGroup_${nodeid}_${reminderGroup.type}`}>
              <Title>{reminderGroup.label}</Title>
              <RemindersWrapper>
                {reminderGroup.reminders.map((reminder) => {
                  const remState = getReminderState(reminder)
                  if (remState === 'active' || remState === 'snooze') {
                    return (
                      <ReminderUI
                        controls={activeOrSnoozedControls}
                        key={`ReultForSearch_${reminder.id}`}
                        reminder={reminder}
                      />
                    )
                  }
                  if (reminder.time > Date.now()) {
                    return (
                      <ReminderUI controls={futureControls} key={`ReultForSearch_${reminder.id}`} reminder={reminder} />
                    )
                  }
                  if (reminder.time < Date.now() && !reminder.state.done) {
                    return (
                      <ReminderUI
                        controls={activeOrSnoozedControls}
                        key={`ReultForSearch_${reminder.id}`}
                        reminder={reminder}
                      />
                    )
                  }
                  return (
                    <ReminderUI controls={pastControls} key={`ReultForSearch_${reminder.id}`} reminder={reminder} />
                  )
                })}
              </RemindersWrapper>
            </ReminderGroupWrapper>
          )
        )}
      </ReminderInfobar>
    </InfobarFull>
  )
}

export default RemindersInfobar
