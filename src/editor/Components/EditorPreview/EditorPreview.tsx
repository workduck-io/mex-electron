import Tippy from '@tippyjs/react/headless' // different import path!
import React, { forwardRef, useState } from 'react'
import { useContentStore } from '../../../store/useContentStore'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import { EditorPreviewWrapper } from './EditorPreview.styles'

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  isPreview?: boolean
  preview?: boolean
  previewRef?: any
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

const EditorPreview = ({ nodeid, placement, isPreview, preview, children, previewRef, delay }: EditorPreviewProps) => {
  const getContent = useContentStore((store) => store.getContent)
  const content = getContent(nodeid)
  const cc = content && content.content

  if (cc) {
    return (
      <LazyTippy
        interactive
        delay={delay ?? 250}
        interactiveDebounce={100}
        placement={placement ?? 'bottom'}
        visible={preview}
        appendTo={() => document.body}
        render={(attrs) => (
          <EditorPreviewWrapper className="__editor__preview" tabIndex={-1} {...attrs}>
            {cc && <EditorPreviewRenderer content={cc} editorId={`__preview__${nodeid}`} />}
          </EditorPreviewWrapper>
        )}
      >
        {children}
      </LazyTippy>
    )
  } else return children
}

export default EditorPreview
