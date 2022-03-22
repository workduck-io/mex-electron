import { add, sub } from 'date-fns'
import create from 'zustand'
import { ItemExtraType } from '../components/spotlight/SearchResults/types'
import { CategoryType } from '../store/Context/context.spotlight'

/*
 * Need
 *   current date
 *   selected date
 *
 * Show
 *   Calendar with dates
 *   Event timeline with events
 */

interface EventPerson {
  email: string
  displayName?: string
  /**
   * Whether this is an optional attendee. Optional. The default is False.
   */
  optional?: boolean | null
  /**
   * Whether the attendee is the organizer of the event. Read-only. The default is False.
   */
  organizer?: boolean | null
  /**
   * Whether the attendee is a resource. Can only be set when the attendee is added to the event for the first time. Subsequent modifications are ignored. Optional. The default is False.
   */
  resource?: boolean | null
  /**
   * The attendee's response status. Possible values are:
   * - "needsAction" - The attendee has not responded to the invitation.
   * - "declined" - The attendee has declined the invitation.
   * - "tentative" - The attendee has tentatively accepted the invitation.
   * - "accepted" - The attendee has accepted the invitation.
   */
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted' | null

  creator?: boolean | null
}

export interface CalendarEvent {
  id: string
  status: 'confirmed' | 'tentative' | 'cancelled'
  // - The event is confirmed. This is the default status.
  // - The event is tentatively confirmed.
  // - The event is cancelled (deleted). The list method returns cancelled events only on incremental sync (when syncToken or updatedMin are specified) or if the showDeleted flag is set to true. The get method always returns them.
  // Title of the event
  summary?: string
  description?: string

  links: {
    meet?: string
    event?: string
  }

  creator?: {
    displayName?: string
    email?: string
    id?: string
  } | null

  times: {
    created: number
    updated: number
    start: number
    end: number
  }
  people: EventPerson[]
}

interface UserCalendarState {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
}

const useCalendarStore = create<UserCalendarState>((set) => ({
  events: [],
  setEvents: (events) => set({ events })
}))

export const useCalendar = () => {
  const getUserEvents = () => {
    const events = useCalendarStore.getState().events
    return events
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const twoHoursFromNow = add(today, { hours: 2 })
    const oneHourBefore = sub(today, { hours: 1 })
    const events = useCalendarStore.getState().events
    const todayEvents = events
      .filter((event) => {
        const start = new Date(event.times.start)
        return start >= oneHourBefore && start <= twoHoursFromNow
      })
      .sort((a, b) => a.times.start - b.times.start)

    const todayEventList = todayEvents.map((e) => ({
      id: e.id,
      icon: 'calendar',
      title: e.summary,
      description: e.description,
      type: 'open',
      category: CategoryType.action
    }))

    return todayEventList
  }

  return {
    getUserEvents,
    getUpcomingEvents
  }
}
