// TypeScript Users only add this code
import { PlateEditor } from '@udecode/plate'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    CEditor: PlateEditor
    Element: CustomElement
    Text: CustomText
  }
}

declare module 'lottie-react'
