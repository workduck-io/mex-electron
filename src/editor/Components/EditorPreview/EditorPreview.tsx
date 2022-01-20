import Tippy from '@tippyjs/react/headless' // different import path!
import React, { forwardRef, useState } from 'react'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import { useContentStore } from '../../Store/ContentStore'
import { EditorPreviewWrapper } from './EditorPreview.styles'

export interface EditorPreviewProps {
  uid: string
  children: React.ReactElement
  isPreview: boolean
  previewRef: any
}

export const LazyTippy = forwardRef(function LT(props: any, ref) {
  const [mounted, setMounted] = useState(false)

  const lazyPlugin = {
    fn: () => ({
      onMount: () => {
        setMounted(true)
      },
      onHidden: () => {
        setMounted(false)
      }
    })
  }

  const computedProps = { ...props }

  computedProps.plugins = [lazyPlugin, ...(props.plugins || [])]

  if (props.render) {
    computedProps.render = (...args) => (mounted ? props.render(...args) : '')
  } else {
    computedProps.content = mounted ? props.content : ''
  }

  return <Tippy {...computedProps} ref={ref} />
})

const EditorPreview = ({ uid, isPreview, children, previewRef }: EditorPreviewProps) => {
  const getContent = useContentStore((store) => store.getContent)
  const content = getContent(uid)
  const cc = content && content.content

  if (cc) {
    return (
      <LazyTippy
        interactive
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => (
          <EditorPreviewWrapper className="__editor__preview" tabIndex={-1} {...attrs}>
            {cc && <EditorPreviewRenderer content={cc} editorId={`__preview__${uid}`} />}
          </EditorPreviewWrapper>
        )}
      >
        {children}
      </LazyTippy>
    )
  } else return children
}

export default EditorPreview
