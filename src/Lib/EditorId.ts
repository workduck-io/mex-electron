const EditorIdPrefix = 'StandardEditor'
export const getEditorId = (uid: string, version: number, loading: boolean) =>
  `${EditorIdPrefix}_${uid}_${version}_${loading ? 'loading' : 'edit'}`
