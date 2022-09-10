import React from 'react'

import { NodeEditorContent } from '../types/Types'

export interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  placeholder?: string
  blockId?: string
  noMouseEvents?: boolean
  readOnly?: boolean
  onChange?: (val: NodeEditorContent) => void
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
