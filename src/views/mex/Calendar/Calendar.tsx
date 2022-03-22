import React from 'react'
import { CalendarEvent, useCalendar } from '../../../hooks/useCalendar'
import { Title } from '../../../style/Typography'

interface EventProps {
  event: CalendarEvent
}

export const Event = ({ event }: EventProps) => {
  return (
    <div>
      <Title>{event.summary}</Title>
      <p>{event.description}</p>
    </div>
  )
}

const Calendar = () => {
  const { getUserEvents } = useCalendar()
  const events = getUserEvents()
  return (
    <div>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  )
}

export default Calendar
