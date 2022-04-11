import { generateSnippetId } from '../Defaults/idPrefixes'
import { PRDTemplate } from './PRD_Snippet'

export const initialSnippets = [
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'PRD',
    content: PRDTemplate
  }
]
