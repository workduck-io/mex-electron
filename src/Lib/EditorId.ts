const EditorIdPrefix = 'StandardEditor'
export const getEditorId = (
  uid: string,
  // updatedAt: string,
  loading: boolean
) =>
  // `${EditorIdPrefix}_${uid}_${updatedAt}_${loading ? 'loading' : 'edit'}`
  `${EditorIdPrefix}_${uid}_${loading ? 'loading' : 'edit'}`
