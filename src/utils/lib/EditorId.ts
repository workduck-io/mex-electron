const EditorIdPrefix = 'StandardEditor'
export const getEditorId = (
  nodeid: string,
  // updatedAt: string,
  loading: boolean
) =>
  // `${EditorIdPrefix}_${nodeid}_${updatedAt}_${loading ? 'loading' : 'edit'}`
  `${EditorIdPrefix}_${nodeid}_${loading ? 'loading' : 'edit'}`
