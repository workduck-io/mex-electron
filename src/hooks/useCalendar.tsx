import { client } from '@workduck-io/dwindle'
import axios from 'axios'
import { add, formatDistanceToNow, sub } from 'date-fns'
import { useEffect } from 'react'
import create from 'zustand'
import { GOOGLE_CAL_BASE, GOOGLE_OAUTH2_REFRESH_URL } from '../apis/routes'
import { ItemActionType, ListItemType } from '../components/spotlight/SearchResults/types'
import { testEvents } from '../data/Defaults/Test/calendar'
import { showRemoteNotification } from '../electron/utils/notifications'
import { checkTokenGoogleCalendar, fetchNewCalendarToken, useTokenStore } from '../services/auth/useTokens'
import { CategoryType } from '../store/Context/context.spotlight'
import { GoogleEvent } from '../types/gcal'
import { mog } from '../utils/lib/helper'

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

const convertCalendarEventToAction = (e: CalendarEvent) => {
  const desc = e.description ? `: ${e.description}` : ''
  return {
    id: e.id,
    icon: 'ri-calendar-event-line',
    title: e.summary,
    description: formatDistanceToNow(e.times.start, { addSuffix: true }) + ` ${desc}`,
    type: ItemActionType.open,
    category: CategoryType.action,
    shortcut: {
      open: {
        title: 'to open Meeting',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: {
      base_url: e.links.meet ?? e.links.event
    }
  }
}

const converGoogleEventToCalendarEvent = (event: GoogleEvent): CalendarEvent => {
  const createdTime = Date.parse(event.created)
  const updatedTime = Date.parse(event.updated)
  const startTime = Date.parse(event.start.dateTime ?? event.start.date)
  const endTime = Date.parse(event.end.dateTime ?? event.end.date)
  return {
    id: event.id,
    status: event.status as any,
    summary: event.summary,
    description: event.description,
    links: {
      meet: event.hangoutLink,
      event: event.htmlLink
    },
    creator: event.creator,
    times: {
      created: createdTime,
      updated: updatedTime,
      start: startTime,
      end: endTime
    },
    people: event.attendees?.map((attendee) => {
      return {
        email: attendee.email,
        displayName: attendee.displayName,
        optional: attendee.optional,
        organizer: attendee.email === event.organizer?.email,
        responseStatus: attendee.responseStatus as any,
        creator: attendee.email === event.creator?.email,
        resource: attendee.resource
      }
    })
  }
}

export const useCalendarStore = create<UserCalendarState>((set) => ({
  events: testEvents.map(converGoogleEventToCalendarEvent),
  setEvents: (events) => set({ events })
}))

export const useCalendar = () => {
  const setEvents = useCalendarStore((state) => state.setEvents)
  const updateToken = useTokenStore((state) => state.updateGoogleCalendarToken)

  const getUserEvents = () => {
    const events = useCalendarStore.getState().events
    return events
  }

  const getUpcomingEvents = (isFromNotification = false) => {
    const now = new Date()
    const timeFromNow = isFromNotification ? add(now, { minutes: 15 }) : add(now, { hours: 2 })
    const fifteenMinutesBefore = sub(now, { minutes: 15 })
    const events = useCalendarStore.getState().events
    const todayEvents = events
      .filter((event) => {
        const start = new Date(event.times.start)
        return start >= fifteenMinutesBefore && start <= timeFromNow
      })
      .sort((a, b) => a.times.start - b.times.start)

    const todayEventList: ListItemType[] = todayEvents.map(convertCalendarEventToAction)

    return todayEventList
  }

  const fetchGoogleCalendarEvents = async () => {
    const now = new Date()
    const yesterday = sub(now, { days: 1 }).toISOString()
    const twoDaysFromNow = add(now, { days: 2 }).toISOString()
    const tokens = useTokenStore.getState().data
    const max = 5

    const tokenStatus = checkTokenGoogleCalendar(tokens)

    switch (tokenStatus) {
      case 'absent':
        return
      case 'expired': {
        const refreshToken = tokens.googleAuth.calendar.refreshToken
        const resp = await fetchNewCalendarToken(refreshToken)
        const { accessToken, idToken } = resp
        mog('refresh token', { resp, accessToken, idToken })
        updateToken(accessToken, idToken)
        return
      }
      case 'active':
        break
    }

    mog('fetching events', { now, yesterday, twoDaysFromNow })
    const reqUrl = encodeURI(
      `${GOOGLE_CAL_BASE}/primary/events?maxResults=${max}&timeMin=${yesterday}&timeMax=${twoDaysFromNow}&singleEvents=true`
    )
    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer ${tokens.googleAuth.calendar.accessToken}`
        }
      })
      .then((res) => {
        const events = res.data.items.map((event) => converGoogleEventToCalendarEvent(event))
        console.log('Got Events', res.data)
        setEvents(events)
      })

    // When client is accessible, use it to get the events
    // client
    //   .get('', {
    //     headers: {
    //       'mex-google-access-token': tokens.googleAuth.calendar.accessToken,
    //       'mex-google-id-token': tokens.googleAuth.calendar.idToken
    //     }
    //   })
    //   .then((response) => {
    //     const events = response.data.map(converGoogleEventToCalendarEvent)
    //     console.log('We got em events', { events })
    //     setEvents(events)
    //   })
  }
  const notifyGoogleEvent = (recentEvents) => {
    try {
      for (const event of recentEvents) {
        const NOTIFICATION_TITLE = event.title
        const EVENT_SUMMARY = `Join the Google Meeting`
        showRemoteNotification(NOTIFICATION_TITLE, EVENT_SUMMARY, () => {
          window.open(event.extras.base_url)
        })
      }
    } catch (error) {
      mog('Error in fetching the google event', { message: error.message }, { collapsed: false, pretty: true })
    }
  }

  return {
    notifyGoogleEvent,
    getUserEvents,
    getUpcomingEvents,
    fetchGoogleCalendarEvents
  }
}

export const useGoogleCalendarAutoFetch = () => {
  const tokens = useTokenStore((state) => state.data)
  const { fetchGoogleCalendarEvents } = useCalendar()

  useEffect(() => {
    console.log('Setting up autofetch for Google Calendar Events')
    const id = setInterval(() => {
      console.log('Fetching Google Calendar Events')
      fetchGoogleCalendarEvents()
    }, 1000 * 60 * 15) // 15 minutes
    return () => clearInterval(id)
  }, [tokens])
}
