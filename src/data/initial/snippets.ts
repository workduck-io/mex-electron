import { generateSnippetId } from '../Defaults/idPrefixes'
import { ABTestingSnippet } from './ABTestingSnippet'
import { BugReportTemplate } from './bugReportTemplate'
import { DesignSpecSnippet } from './DesignSpecSnippet'
import { GTMPlanSnippet } from './GTMPlanSnippet'
import { OnePagerSnippet } from './OnePagerSnippet'
import { PRDTemplate } from './PRD_Snippet'
import { ProductSpecSnippet } from './ProductSpecSnippet'
import { ReleaseSnippet } from './ReleaseSnippet'

/**
 * ## Creating Initial Snippet Templates
 *
 * Use the Snippet copier button in dev mode to get the snippet content
 * and wrap it with insertId function to create content
 *
 * Do replace the other IDs such as questionId in the content
 *
 * 1. [x] Product Spec
 * 2. Design Spec
 * 3. [x] Bug Report
 * 4. [x] PRD
 * 5. [x] A/B Testing
 * 6. [x] One Pager / Concept Note
 * 7. [x] Release Checklist
 * 8. [x] GTM Plan
 *
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
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'Release Checklist',
    content: ReleaseSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'One Pager',
    content: OnePagerSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'A/B Testing',
    content: ABTestingSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'Product Spec',
    content: ProductSpecSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'GTM Plan',
    content: GTMPlanSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    isTemplate: true,
    title: 'Design Spec',
    content: DesignSpecSnippet
  }
]
