import React from 'react'
import Tippy from '@tippyjs/react/headless' // different import path!
import Editor from '../../Editor'
import { useContentStore } from '../../Store/ContentStore'
import { EditorPreviewWrapper } from './EditorPreview.styles'

export interface EditorPreviewProps {
  id: string
  children: React.ReactElement
}

const EditorPreview = ({ id, children }: EditorPreviewProps) => {
  const getContent = useContentStore((store) => store.getContent)

  const content = getContent(id)

  return (
    <Tippy
      interactive
      render={(attrs) => (
        <EditorPreviewWrapper tabIndex={-1} {...attrs} data-placement="top">
          {content && <Editor content={content.content} readOnly editorId={`preview_${id}`} />}
        </EditorPreviewWrapper>
      )}
    >
      {children}
    </Tippy>
  )
}

export default EditorPreview
