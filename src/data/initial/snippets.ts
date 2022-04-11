import { generateSnippetId } from '../Defaults/idPrefixes'
import { BugReportTemplate } from './bugReportTemplate'
import { PRDTemplate } from './PRD_Snippet'

/**
 * ## Creating Initial Snippet Templates
 *
 * Use the Snippet copier button in dev mode to get the snippet content
 * and wrap it with insertId function to create content
 *
 * Do replace the other IDs such as questionId in the content
 */

export const initialSnippets = [
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'PRD',
    content: PRDTemplate
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'Bug Report',
    content: BugReportTemplate
  }
]
