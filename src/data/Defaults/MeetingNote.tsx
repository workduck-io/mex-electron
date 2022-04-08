import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { generateTempId } from './idPrefixes'

export const MeetingSnippetContent = [
  {
    id: generateTempId(),
    type: ELEMENT_PARAGRAPH,
    children: [{ text: 'This is a meeting of meetings' }]
  }
]
