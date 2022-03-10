// Icons for sidebar and UI
import bxChevronDownCircle from '@iconify/icons-bx/bx-chevron-down-circle'
import checkboxBlankCircleFill from '@iconify/icons-ri/checkbox-blank-circle-fill'
import checkboxBlankCircleLine from '@iconify/icons-ri/checkbox-blank-circle-line'
import draftFill from '@iconify/icons-ri/draft-fill'
import draftLine from '@iconify/icons-ri/draft-line'
// Icons for Editor
import externalLinkLine from '@iconify/icons-ri/external-link-line'
import starFill from '@iconify/icons-ri/star-fill'
import starLine from '@iconify/icons-ri/star-line'
import taskFill from '@iconify/icons-ri/task-fill'
import taskLine from '@iconify/icons-ri/task-line'

// `any` is used in type signature as `IconifyIcon` type doesn't work

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const MexIcons: { [key: string]: [any, any] } = {
  // First element of array is of closed Icon and the second is for open
  openClose: [checkboxBlankCircleFill, bxChevronDownCircle],
  circle: [checkboxBlankCircleFill, checkboxBlankCircleLine],
  pursuits: [starFill, starLine],
  starred: [starFill, starLine],
  tasks: [taskFill, taskLine],
  drafts: [draftFill, draftLine]
}

export const MexNodeIcons: { [key: string]: [any, any] } = {
  'ri:task-line': [taskFill, taskLine],
  'ri:draft-line': [draftFill, draftLine]
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const EditorIcons: { [name: string]: any } = {
  externalLink: externalLinkLine
}

export default MexIcons
