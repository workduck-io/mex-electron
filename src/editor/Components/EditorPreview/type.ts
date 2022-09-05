import { NodeEditorContent } from "@types/types"
import React from 'react';

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  label?: string
  content?: NodeEditorContent
  allowClosePreview?: boolean
  setPreview?: (open: boolean) => void
}