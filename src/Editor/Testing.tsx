import { ELEMENT_H1, ELEMENT_PARAGRAPH } from '@udecode/plate'
import faker from 'faker'
import React from 'react'
import Editor from './Editor'

const HEADINGS = 100
const PARAGRAPHS = 7

export const getHugeDocument = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hugeDocument: any[] = []

  for (let h = 0; h < HEADINGS; h++) {
    hugeDocument.push({
      type: ELEMENT_H1,
      children: [{ text: faker.lorem.sentence() }],
    })

    for (let p = 0; p < PARAGRAPHS; p++) {
      hugeDocument.push({
        type: ELEMENT_PARAGRAPH,
        children: [{ text: faker.lorem.paragraph() }],
      })
    }
  }

  return hugeDocument
}

const hd = getHugeDocument()

export const Tester = () => {
  return (
    <div className="flex">
      <Editor content={hd} editorId="HUGE_EDITOR" />
    </div>
  )
}
