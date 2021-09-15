import { PlatePlugin, SPEditor } from '@udecode/plate'

export interface BlurSelectionEditor extends SPEditor {
  selection: any
  blurSelection: any
  prevSelection: any
}

export const setBlurSelection = (editor: BlurSelectionEditor) => {
  if (editor && editor.selection) {
    editor.blurSelection = editor.selection
    editor.prevSelection = editor.selection
  }
}

export const clearBlurSelection = (editor: BlurSelectionEditor) => {
  if (editor && editor.blurSelection) {
    editor.blurSelection = undefined
  }
}

export const isBlurSelection = (editor: BlurSelectionEditor) => {
  if (editor && editor.blurSelection !== undefined) {
    return true
  }
  return false
}

export const createBlurSelectionPlugin = (): PlatePlugin<BlurSelectionEditor> => ({
  onBlur: (editor) => () => {
    setBlurSelection(editor)
  }
})
