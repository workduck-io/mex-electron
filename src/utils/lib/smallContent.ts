// Helper functions to generate small content
//
//
// Use insertId to add randomized ids to the generated content
import { ELEMENT_MENTION } from '@editor/Components/mentions/defaults'
import { ELEMENT_TAG } from '@editor/Components/tag/defaults'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_LINK, ELEMENT_PARAGRAPH, ELEMENT_UL } from '@udecode/plate'

import { ELEMENT_TODO_LI, generateTempId } from '@workduck-io/mex-utils'

export const textChildren = (text: string) => [
  {
    text
  }
]

export const text = (text: string) => ({
  text
})

export const pText = (text: string) => ({
  type: ELEMENT_PARAGRAPH,
  text
})

export const emptyText = () => ({
  text: ''
})

export const emptyChildren = () => [
  {
    text: ''
  }
]

export const emptyP = () => ({
  type: ELEMENT_PARAGRAPH,
  children: emptyChildren()
})

export const pChildren = (children: any[]) => ({
  type: ELEMENT_PARAGRAPH,
  children
})

export const list = (listItems: string[]) => ({
  type: ELEMENT_UL,
  children: [
    ...listItems.map((item) => ({
      type: ELEMENT_LI,
      children: [
        {
          type: ELEMENT_LIC,
          children: [{ text: item }]
        }
      ]
    }))
  ]
})

export const tag = (value: string) => ({ type: ELEMENT_TAG, children: [{ text: '' }], value })

export const aLink = (url: string, text: string) => ({
  type: ELEMENT_LINK,
  url,
  children: textChildren(text)
})

export const task = (text: string) => ({
  type: ELEMENT_TODO_LI,
  entityId: generateTempId(),
  children: textChildren(text)
})

export const heading = (level: number, text: string) => ({
  type: `h${level}`,
  children: textChildren(text)
})

export const mentionList = (ids: string[]) =>
  ids.map((id) => ({
    type: ELEMENT_MENTION,
    children: emptyChildren(),
    value: id
  }))
