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
    attendees.length > 0
      ? {
          type: 'p',
          children: [
            {
              type: 'p',
              text: 'Attendees: '
            },
            ...attendees.map((id) => ({
              type: 'mention',
              children: [
                {
                  text: ''
                }
              ],
              value: id
            })),
            {
              type: 'p',
              text: ''
            }
          ]
        }
      : { type: 'p', children: [{ text: '' }] }

  return [
    { type: 'h1', children: [{ text: title }] },
    {
      type: 'p',
      children: [
        { text: '' },
        { type: 'tag', children: [{ text: '' }], value: 'meeting' },
        { text: ` On ${toLocaleString(new Date(date))} - ` },
        { type: 'a', url: link, children: [{ text: 'Link' }] },
        { text: '' }
      ]
    },
    attendeesJSON,
    { type: 'h2', children: [{ text: 'Updates' }] },
    {
      type: 'ul',
      children: [
        {
          type: 'li',
          children: [{ type: 'lic', children: [{ text: 'Updates of the team here' }] }]
        }
      ]
    },
    { type: 'p', children: [{ text: '' }] },
    { type: 'h2', children: [{ text: 'Agenda' }] },
    {
      type: 'ul',
      children: [
        {
          type: 'li',
          children: [{ type: 'lic', children: [{ text: 'List items for agenda here' }] }]
        }
      ]
    },
    { type: 'p', children: [{ text: '' }] },
    { type: 'h2', children: [{ text: 'Tasks' }] },
    { type: 'action_item', children: [{ text: 'Create tasks here' }] },
    { type: 'p', children: [{ text: '' }] },
    { type: 'h2', children: [{ text: 'Questions' }] },
    {
      type: 'ul',
      children: [
        {
          type: 'li',
          children: [
            {
              type: 'lic',
              children: [{ text: 'Any Questions asked?' }]
            }
          ]
        }
      ]
    },
    { type: 'p', children: [{ text: '' }] }
  ]
}

export const MeetingSnippetContent = (data: MeetingTemplateData) => insertId(meetingTemplate(data))
