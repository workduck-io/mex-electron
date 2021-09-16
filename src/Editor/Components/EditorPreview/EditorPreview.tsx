import React from 'react'
import Tippy from '@tippyjs/react/headless' // different import path!
import Editor from '../../Editor'
import { useContentStore } from '../../Store/ContentStore'

export interface EditorPreviewProps {
  id: string
  children: React.ReactElement
}

const EditorPreview = ({ id, children }: EditorPreviewProps) => {
  const getContent = useContentStore((store) => store.getContent)

  const content = getContent(id)

  return (
    <Tippy
      render={(attrs) => (
        <div tabIndex={-1} {...attrs}>
          {content && <Editor content={content.content} readOnly editorId={`preview_${id}`} />}
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}

export default EditorPreview
