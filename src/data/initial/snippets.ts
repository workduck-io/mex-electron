import type { Snippet } from '../../store/useSnippetStore'
import { generateSnippetId } from '../Defaults/idPrefixes'
import { ABTestingSnippet } from './ABTestingSnippet'
import { DesignSpecSnippet } from './DesignSpecSnippet'
import { DesignSprintSnippet } from './DesignSprint'
import { GTMPlanSnippet } from './GTMPlanSnippet'
import { GrowthSnippet } from './GrowthSnippet'
import { OnePagerSnippet } from './OnePagerSnippet'
import { PRDTemplate } from './PRD_Snippet'
import { ProductSpecSnippet } from './ProductSpecSnippet'
import { ReleaseSnippet } from './ReleaseSnippet'
import { SprintReviewSnippet } from './SprintReview'
import { BugReportTemplate } from './bugReportTemplate'
import { OnboardingDoc } from './onboardingDoc'

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

export const initialSnippets: Snippet[] = [
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'PRD',
    content: PRDTemplate
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Bug Report',
    content: BugReportTemplate
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Release Checklist',
    content: ReleaseSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'One Pager',
    content: OnePagerSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'A B Testing',
    content: ABTestingSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Product Spec',
    content: ProductSpecSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'GTM Plan',
    content: GTMPlanSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Design Spec',
    content: DesignSpecSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Design Sprint Retrospective',
    content: DesignSprintSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Sprint Review',
    content: SprintReviewSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Growth Meeting',
    content: GrowthSnippet
  },
  {
    icon: 'ri:quill-pen-line',
    id: generateSnippetId(),
    template: true,
    title: 'Onboarding',
    content: OnboardingDoc
  }
]
