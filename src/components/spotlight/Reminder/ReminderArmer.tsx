import { add } from 'date-fns'
import React, { useEffect } from 'react'
import { useReminders, useReminderStore } from '../../../hooks/useReminders'
import { mog } from '../../../utils/lib/helper'

const ReminderArmer = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const { getToArmReminders, armReminders, clearArmedReminders, armMissedReminders } = useReminders()

  useEffect(() => {
    const toArmRems = getToArmReminders()
    mog('ReminderArmer: useEffect', { reminders, toArmRems })

    if (toArmRems.length > 0) {
      toArmRems.forEach((rems) => armReminders(rems.reminders, rems.time))
    } else {
      armMissedReminders()
    }

    const intervalId = setInterval(() => {
      armMissedReminders()
    }, 1000 * 60 * 15) // fifteen minutes

    return () => {
      mog('ReminderArmer: unArming reminders', { reminders })
      clearInterval(intervalId)
      clearArmedReminders()
    }
  }, [reminders])

  return <></>
}

export default ReminderArmer
