import { ELEMENT_H1, ELEMENT_PARAGRAPH, ELEMENT_TH, withPlaceholders } from '@udecode/plate'

export const withStyledPlaceHolders = (components: any) =>
  withPlaceholders(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type  /  to see options',
      hideOnBlur: true
    },
    {
      key: ELEMENT_H1,
      placeholder: 'Untitled',
      hideOnBlur: false
    },
    {
      key: ELEMENT_TH,
      placeholder: 'Header',
      hideOnBlur: true
    }
  ])
