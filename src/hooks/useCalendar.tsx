import { useEffect } from 'react'

import { useApi } from '@apis/useSaveApi'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'
import { useUserService } from '@services/auth/useUserService'
import { useContentStore } from '@store/useContentStore'
import axios from 'axios'
import { add, format, formatDistanceToNow, sub } from 'date-fns'
import jwt_decode from 'jwt-decode'
import create from 'zustand'

import { GOOGLE_CAL_BASE } from '../apis/routes'
import { SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { ItemActionType, ListItemType } from '../components/spotlight/SearchResults/types'
import { MEETING_PREFIX } from '../data/Defaults/idPrefixes'
import { MeetingSnippetContent } from '../data/initial/MeetingNote'
import { useAuthStore } from '../services/auth/useAuth'
import { checkTokenGoogleCalendar, fetchNewCalendarToken, useTokenStore } from '../services/auth/useTokens'
import { CategoryType } from '../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../store/app.spotlight'
import { useSpotlightEditorStore } from '../store/editor.spotlight'
import useDataStore from '../store/useDataStore'
import { ILink } from '../types/Types'
import { GoogleEvent } from '../types/gcal'
import { mog } from '../utils/lib/helper'
import { getSlug } from '../utils/lib/strings'
import { useCreateNewNote } from './useCreateNewNote'

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

  /**
   * UserID of the attendee in mex if it exists
   */
  mexUserID?: string
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

const GoogleCalendarActionData = {
  actionGroupId: 'GOOGLE_CALENDAR',
  name: 'Google Calendar',
  description: 'Integrate Mex with your Google Calendar and track your meetings and events!',
  icon: 'logos:google-calendar',
  permissions: '__UNSET__'
}

export const openCalendarMeetingNote = (
  e: CalendarEvent,
  getMeetingNote: (e: CalendarEvent, create?: boolean) => ILink | undefined
) => {
  // if link present use it
  const node = getMeetingNote(e, true)
  const content = useContentStore.getState().getContent(node?.nodeid)
  // const content = getContent(node.nodeid)
  const realContent =
    content !== undefined
      ? content?.content
      : MeetingSnippetContent({
          title: e.summary,
          date: e.times.start,
          link: e.links.meet ?? e.links.event,
          attendees: getAttendeeUserIDsFromCalendarEvent(e)
        })

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

const convertCalendarEventToAction = (
  e: CalendarEvent,
  getMeetingNote: (e: CalendarEvent, create?: boolean) => ILink | undefined
) => {
  const node = getMeetingNote(e, false)
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
        openCalendarMeetingNote(e, getMeetingNote)
      }
    }
  }
}

const converGoogleEventToCalendarEvent = async (
  event: GoogleEvent,
  getMexUserID: (email: string) => Promise<string | undefined>
): Promise<CalendarEvent> => {
  const createdTime = Date.parse(event.created)
  const updatedTime = Date.parse(event.updated)
  const startTime = Date.parse(event.start.dateTime ?? event.start.date)
  const endTime = Date.parse(event.end.dateTime ?? event.end.date)
  const people =
    event.attendees !== undefined
      ? await Promise.all(
          event.attendees.map(async (a) => {
            const person: EventPerson = {
              email: a.email,
              displayName: a.displayName,
              optional: a.optional,
              organizer: a.email === event.organizer?.email,
              responseStatus: a.responseStatus as any,
              creator: a.email === event.creator?.email,
              resource: a.resource
            }
            if (person.email) {
              const userID = await getMexUserID(person.email)
              if (userID) {
                person.mexUserID = userID
              }
            }
            return person
          })
        )
      : []

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
    people
  }
}

export const useCalendarStore = create<UserCalendarState>((set) => ({
  events: [],
  setEvents: (events) => set({ events })
}))

export const getAttendeeUserIDsFromCalendarEvent = (event: CalendarEvent) => {
  if (event?.people) {
    return event.people.filter((p) => p.mexUserID).map((p) => p.mexUserID)
  }
  return []
}

export const useCalendar = () => {
  const setEvents = useCalendarStore((state) => state.setEvents)
  const updateToken = useTokenStore((state) => state.updateGoogleCalendarToken)
  const tokenData = useTokenStore((state) => state.data)
  const removeToken = useTokenStore((state) => state.removeGoogleCalendarToken)
  const { createNewNote } = useCreateNewNote()
  const { getGoogleAuthUrl } = useApi()
  const { getUserDetails } = useUserService()

  const getUserEvents = () => {
    const events = useCalendarStore.getState().events
    return events
  }

  const getNodeForMeeting = (e: CalendarEvent, create?: boolean): ILink | undefined => {
    const customName = `${MEETING_PREFIX}${SEPARATOR}${getSlug(e.summary)} ${format(e.times.start, 'dd-MM-yyyy')}`
    const links = useDataStore.getState().ilinks

    const link = links?.find((l) => l.path === customName)

    const node = link
      ? link
      : create
      ? createNewNote({
          path: customName,
          noteContent: MeetingSnippetContent({
            title: e.summary,
            date: e.times.start,
            link: e.links.meet ?? e.links.event,
            attendees: getAttendeeUserIDsFromCalendarEvent(e)
          })
        })
      : undefined

    return node
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

    const todayEventList: ListItemType[] = todayEvents.map((e) => convertCalendarEventToAction(e, getNodeForMeeting))

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

    const getMexUserID = async (email: string) => {
      const user = await getUserDetails(email)
      return user?.userID
    }

    axios
      .get(reqUrl, {
        headers: {
          Authorization: `Bearer ${tokens.googleAuth.calendar.accessToken}`
        }
      })
      .then(async (res) => {
        const events = await Promise.all(
          res.data.items.map(async (event) => await converGoogleEventToCalendarEvent(event, getMexUserID))
        )
        console.log('Got Events', res.data, events)
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

  const getGoogleCalendarAction = (): ActionGroupType => {
    const idToken = tokenData?.googleAuth?.calendar?.idToken
    const authConfig = {
      onConnectAsync: async () => {
        const googleAuthUrl = await getGoogleAuthUrl()
        mog('Requested: googleAuthUrl', { googleAuthUrl })
        window.open(googleAuthUrl, '_blank', 'width=1000,height=1000')
      },
      onDisconnectAsync: async () => {
        mog('onDisconnectAsync: Removing token', { tokenData })
        removeToken()
      }
    }

    if (!idToken) {
      return {
        ...GoogleCalendarActionData,
        tag: '',
        authConfig,
        connected: false
      }
    }

    const decoded = jwt_decode(idToken)

    mog('getGoogleCalendarAction', {
      tokenData,
      idToken,
      decoded
    })
    /* Decoded Token Example
    {
      "iss": "https://accounts.google.com",
      "azp": "XXXX-XXXX.apps.googleusercontent.com",
      "aud": "XXXX-XXXX.apps.googleusercontent.com",
      "sub": "XXXX",
      "email": "aditya.XXXX@gmail.com",
      "email_verified": true,
      "at_hash": "XXXX-XXXX",
      "name": "Aditya XXXX Singh",
      "picture": "https://lh3.googleusercontent.com/a/XXXX=s96-c",
      "given_name": "Aditya XXXX",
      "family_name": "Singh",
      "locale": "en",
      "iat": XXXX,
      "exp": XXXX
    }
    */

    interface DecodedToken {
      email: string
      name: string
      picture: string
    }

    if (decoded) {
      const { email, name, picture } = decoded as DecodedToken
      const userDetails = {
        name,
        picture,
        email
      }
      return {
        ...GoogleCalendarActionData,
        authConfig: { ...authConfig, userDetails },
        tag: '',
        connected: true
      }
    }

    return {
      ...GoogleCalendarActionData,
      authConfig,
      tag: '',
      connected: true
    }
  }

  const getCalendarActions = (): ActionGroupType[] => {
    const actions = [getGoogleCalendarAction()]
    return actions
  }

  return {
    getUserEvents,
    getUpcomingEvents,
    getGoogleCalendarAction,
    getCalendarActions,
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
