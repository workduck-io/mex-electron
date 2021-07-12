import { SlatePlugin, SPEditor } from '@udecode/slate-plugins';

export interface BlurSelectionEditor extends SPEditor {
  selection: any;
  blurSelection: any;
}
export const setBlurSelection = (editor: BlurSelectionEditor) => {
  if (editor.selection) {
    editor.blurSelection = editor.selection;
  }
};

export const createBlurSelectionPlugin = (): SlatePlugin<
  BlurSelectionEditor
> => ({
  onBlur: (editor) => () => {
    setBlurSelection(editor);
  },
});
