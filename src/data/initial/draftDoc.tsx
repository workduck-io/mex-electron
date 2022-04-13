import { NodeContent } from '../../types/data'
import { insertId } from '../../utils/lib/content'
import { toLocaleString } from '../../utils/time'
import { generateQuestionId, generateTempId } from '../Defaults/idPrefixes'

export const draftDoc = insertId([
  {
    type: 'h1',
    children: [
      {
        text: 'Draft'
      }
    ]
  },
  {
    children: [
      {
        text: 'All your captures go here!'
      }
    ],
    type: 'blockquote'
  }
])

export const draftContent: NodeContent = {
  type: 'init',
  content: draftDoc,
  version: -1
}
