import { ELEMENT_H1, ELEMENT_PARAGRAPH, withPlaceholders } from '@udecode/plate'
import React from 'react'

export const withStyledPlaceHolders = (components: any) =>
  withPlaceholders(components, [
    {
      key: ELEMENT_PARAGRAPH,
      children: <h1>Hello</h1>,
      placeholder: 'Type  /  to see options',
      hideOnBlur: true
    },
    {
      key: ELEMENT_H1,
      placeholder: 'Untitled',
      hideOnBlur: false
    }
  ])
