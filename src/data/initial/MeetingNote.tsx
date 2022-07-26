import { mog } from '@utils/lib/helper'
import {
  aLink,
  emptyText,
  emptyP,
  heading,
  list,
  mentionList,
  pChildren,
  pText,
  tag,
  task,
  text,
  textChildren
} from '@utils/lib/smallContent'
import { insertId } from '../../utils/lib/content'
import { toLocaleString } from '../../utils/time'

export interface MeetingTemplateData {
  title: string
  date: number
  link: string
  // user ids of the attendees
  attendees?: string[]
}

const meetingTemplate = ({ title, date, link, attendees }: MeetingTemplateData) => {
  const attendeesJSON =
    attendees.length > 0 ? pChildren([text(`Attendees: `), ...mentionList(attendees), emptyText()]) : emptyP()

  return [
    heading(1, title),
    pChildren([
      emptyText(),
      tag('meeting'),
      text(` On ${toLocaleString(new Date(date))} - `),
      aLink(link, 'Link'),
      emptyText()
    ]),

    attendeesJSON,

    heading(2, 'Updates'),
    list(['Updates of the team here']),

    emptyP(),
    heading(2, 'Agenda'),
    list(['List items for agenda here']),

    emptyP(),
    heading(2, 'Tasks'),
    task('Create tasks here'),

    emptyP(),
    heading(2, 'Questions'),
    list(['Any questions asked']),
    emptyP()
  ]
}

export const MeetingSnippetContent = (data: MeetingTemplateData) => {
  const content = insertId(meetingTemplate(data))
  mog('COntent Meeting', { content })
  return content
}
