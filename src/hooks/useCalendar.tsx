import { useContentStore } from '@store/useContentStore'
import axios from 'axios'
import { add, format, formatDistanceToNow, sub } from 'date-fns'
import { useEffect } from 'react'
import create from 'zustand'
import { GOOGLE_CAL_BASE } from '../apis/routes'
import { SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { ItemActionType, ListItemType } from '../components/spotlight/SearchResults/types'
import { MEETING_PREFIX } from '../data/Defaults/idPrefixes'
import { testEvents } from '../data/Defaults/Test/calendar'
import { MeetingSnippetContent } from '../data/initial/MeetingNote'
import { useAuthStore } from '../services/auth/useAuth'
import { checkTokenGoogleCalendar, fetchNewCalendarToken, useTokenStore } from '../services/auth/useTokens'
import { useSpotlightAppStore } from '../store/app.spotlight'
import { CategoryType } from '../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../store/editor.spotlight'
import useDataStore from '../store/useDataStore'
import { GoogleEvent } from '../types/gcal'
import { ILink } from '../types/Types'
import { mog } from '../utils/lib/helper'
import { getSlug } from '../utils/lib/strings'

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

export const getNodeForMeeting = (title: string, date: number, create?: boolean): ILink | undefined => {
  const customName = `${MEETING_PREFIX}${SEPARATOR}${getSlug(title)} ${format(date, 'dd-MM-yyyy')}`
  const links = useDataStore.getState().ilinks

  const link = links.find((l) => l.path === customName)

  const node = link
    ? link
    : create
    ? useDataStore.getState().addILink({
        ilink: customName
      })
    : undefined

  return node
}

export const openCalendarMeetingNote = (e: CalendarEvent) => {
  // if link present use it
  const node = getNodeForMeeting(e.summary, e.times.start, true)
  const content = useContentStore.getState().getContent(node?.nodeid)
  // const content = getContent(node.nodeid)
  const realContent =
    content !== undefined
      ? content?.content
      : MeetingSnippetContent(e.summary, e.times.start, e.links.meet ?? e.links.event)

  // mog('OpenCalendarMeeting', { e, content, realContent })

  useSpotlightEditorStore.getState().loadNode(
    {
      title: node.path,
      nodeid: node.nodeid,
      id: node.nodeid,
      path: node.path
    },

    realContent
  )

  useSpotlightAppStore.getState().setNormalMode(false)
}

const convertCalendarEventToAction = (e: CalendarEvent) => {
  const node = getNodeForMeeting(e.summary, e.times.start, false)
  const desc = e.description ? `: ${e.description}` : ''
  return {
    id: e.id,
    icon: 'ri-calendar-event-line',
    title: e.summary,
    description: formatDistanceToNow(e.times.start, { addSuffix: true }) + ` ${desc}`,
    type: ItemActionType.twinOpen,
    category: CategoryType.meeting,
    shortcut: {
      open: {
        title: 'to open note',
        category: 'action',
        keystrokes: 'Enter'
      },
      edit: {
        title: 'to open link',
        category: 'action',
        keystrokes: 'Cmd+Enter'
      }
    },
    extras: {
      base_url: e.links.meet ?? e.links.event,
      nodeid: node ? node.nodeid : undefined,
      event: e,
      customAction: () => {
        openCalendarMeetingNote(e)
      }
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
  // const ilink =c

  const getUserEvents = () => {
    const events = useCalendarStore.getState().events
    return events
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    const twoHoursFromNow = add(now, { hours: 2 })
    const fifteenMinutesBefore = sub(now, { minutes: 15 })
    const events = useCalendarStore.getState().events
    const todayEvents = events
      .filter((event) => {
        const start = new Date(event.times.start)
        return start >= fifteenMinutesBefore && start <= twoHoursFromNow
      })
      .sort((a, b) => a.times.start - b.times.start)

    const todayEventList: ListItemType[] = todayEvents.map(convertCalendarEventToAction)

    // mog('calendar', {
    //   events,
    //   todayEventList
    // })

    return todayEventList
  }

  const fetchGoogleCalendarEvents = async () => {
    const now = new Date()
    const yesterday = sub(now, { days: 1 }).toISOString()
    const twoDaysFromNow = add(now, { days: 2 }).toISOString()
    const tokens = useTokenStore.getState().data
    const max = 15

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

    const reqUrl = encodeURI(
      `${GOOGLE_CAL_BASE}/primary/events?maxResults=${max}&timeMin=${yesterday}&timeMax=${twoDaysFromNow}`
    )
    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer ${tokens.googleAuth.calendar.accessToken}`
        }
      })
      .then((res) => {
        const events = res.data.items.map((event) => converGoogleEventToCalendarEvent(event))
        // console.log('Got Events', res.data, events)
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

  return {
    getUserEvents,
    getUpcomingEvents,
    fetchGoogleCalendarEvents
  }
}

export const useGoogleCalendarAutoFetch = () => {
  const tokens = useTokenStore((state) => state.data)
  const { fetchGoogleCalendarEvents } = useCalendar()
  const authenticated = useAuthStore((store) => store.authenticated)

  useEffect(() => {
    if (!authenticated) return
    fetchGoogleCalendarEvents()
    const id = setInterval(() => {
      mog('Fetching Google Calendar Events')
      fetchGoogleCalendarEvents()
    }, 1000 * 60 * 15) // 15 minutes
    return () => clearInterval(id)
  }, [tokens])
}
