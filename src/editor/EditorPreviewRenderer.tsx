import { Plate } from '@udecode/plate'
import React, { useEffect } from 'react'
import { EditorStyles } from '../style/Editor'
import generatePlugins from './Plugins/plugins'
import { editorPreviewComponents } from './Components/components'
import styled from 'styled-components'
import { TodoContainer } from '../ui/components/Todo.style'
import { useBlockHighlightStore, useFocusBlock } from './Actions/useFocusBlock'
import { mog } from '../utils/lib/helper'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  /**
   * Block that will be focused on render
   */
  blockId?: string
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  user-select: none;
  font-size: 14px;

  ${TodoContainer}, button, input, textarea, select, option {
    pointer-events: none;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  noMouseEvents,
  onDoubleClick
}: EditorPreviewRendererProps) => {
  const editableProps = {
    placeholder: 'Murmuring the mex hype... ',
    spellCheck: false,
    style: noStyle
      ? {}
      : {
          padding: '15px'
        },
    readOnly: true
  }

  // We get memoized plugins
  const plugins = generatePlugins(editorPreviewComponents, { exclude: { dnd: true } })
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { selectBlock } = useFocusBlock()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        // mog('editorPreviewRenderer', { blockId, editorId })
        selectBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId, content])

  return (
    <>
      <PreviewStyles
        noMouseEvents={noMouseEvents}
        onClick={(ev) => {
          // ev.preventDefault()
          // ev.stopPropagation()
          if (onDoubleClick && ev.detail === 2) {
            onDoubleClick(ev)
          }
        }}
      >
        <Plate id={editorId} editableProps={editableProps} value={content} plugins={plugins} />
      </PreviewStyles>
    </>
  )
}
export default EditorPreviewRenderer
