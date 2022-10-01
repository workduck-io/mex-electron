import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
import Collapse from '@ui/layout/Collapse/Collapse'
import { Button } from '@workduck-io/mex-components'
import React, { useMemo } from 'react'
import { useReminders, useReminderStore } from '../../../hooks/useReminders'
import { useEditorStore } from '../../../store/useEditorStore'
import useTodoStore from '../../../store/useTodoStore'
import { InfobarFull, InfobarTools } from '../../../style/infobar'
import { Title } from '../../../style/Typography'
import { useCreateReminderModal } from './CreateReminderModal'
import ReminderUI from './Reminder'
import { ReminderGroupWrapper, ReminderInfobar, RemindersWrapper } from './Reminders.style'

const RemindersInfobar = () => {
  // const infobar = useLayoutStore((s) => s.infobar)
  // const { toggleReminder } = useToggleElements()
  // const shortcuts = useHelpStore((store) => store.shortcuts)
  const remindersAll = useReminderStore((store) => store.reminders)
  const armedReminders = useReminderStore((store) => store.armedReminders)
  const { getNodeReminders, getReminderControls } = useReminders()
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const openModal = useCreateReminderModal((state) => state.openModal)
  const todos = useTodoStore((store) => store.todos)

  const reminderGroups = useMemo(() => {
    // mog('RemindersInfobar', { reminderGroups, remindersAll })
    const nodeReminders = getNodeReminders(nodeid)
    return nodeReminders
  }, [remindersAll, nodeid, armedReminders, todos])

  return (
    <InfobarFull>
      {/*
      <InfobarTools>
        <IconButton
          size={24}
          icon={timerFlashLine}
          shortcut={shortcuts.showReminder.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <IconButton
          size={24}
          icon="ri-discuss-line"
          onClick={() => {
            goTo(ROUTE_PATHS.reminders, NavigationType.push)
          }}
          title="All Reminders"
          />
          <label htmlFor="reminders">Reminders</label>
      </InfobarTools>
        */}

      <ReminderInfobar>
        <Button large primary onClick={() => openModal({ nodeid: nodeid })}>
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
            <Collapse
              key={`reminder_${reminderGroup.label}`}
              maximumHeight="40vh"
              defaultOpen
              title={reminderGroup.label}
            >
              <ReminderGroupWrapper key={`ReminderGroup_${nodeid}_${reminderGroup.type}`}>
                <RemindersWrapper>
                  {reminderGroup.reminders.map((reminder) => (
                    <ReminderUI
                      controls={getReminderControls(reminder)}
                      key={`ReminderFo_${reminder.id}`}
                      oid={`ReminderUI_for_${reminder.id}_infobar`}
                      reminder={reminder}
                      inSidebar
                    />
                  ))}
                </RemindersWrapper>
              </ReminderGroupWrapper>
            </Collapse>
          )
        )}
      </ReminderInfobar>
    </InfobarFull>
  )
}

export default RemindersInfobar
