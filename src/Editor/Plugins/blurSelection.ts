import { PlatePlugin, SPEditor } from '@udecode/plate';

export interface BlurSelectionEditor extends SPEditor {
  selection: any;
  blurSelection: any;
}
export const setBlurSelection = (editor: BlurSelectionEditor) => {
  if (editor.selection) {
    editor.blurSelection = editor.selection;
  }
};

export const createBlurSelectionPlugin = (): PlatePlugin<
  BlurSelectionEditor
> => ({
  onBlur: (editor) => () => {
    setBlurSelection(editor);
  },
});
