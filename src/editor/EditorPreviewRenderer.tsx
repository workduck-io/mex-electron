import { Plate } from '@udecode/plate'
import React, { useEffect, useMemo } from 'react'
import { EditorStyles } from '../style/Editor'
import generatePlugins from './Plugins/plugins'
import { editorPreviewComponents } from './Components/components'
import styled from 'styled-components'
import { TodoContainer } from '../ui/components/Todo.style'
import { useBlockHighlightStore, useFocusBlock } from './Actions/useFocusBlock'
import { FadeContainer } from '../style/animation/fade'
import { useEditorChange } from '@hooks/useEditorActions'
import { NodeEditorContent } from '../types/Types'
import { debounce } from 'lodash'
import { components } from 'react-select'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'

interface EditorPreviewRendererProps {
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

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  /* user-select: none; */
  font-size: 0.9rem;

  ${TodoContainer}, button, input, textarea, select, option {
    pointer-events: none;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  placeholder,
  noMouseEvents,
  onClick,
  onChange,
  readOnly,
  onDoubleClick
}: EditorPreviewRendererProps) => {
  const editableProps = useMemo(
    () => ({
      placeholder: 'Murmuring the mex hype... ',
      spellCheck: !readOnly,
      style: noStyle
        ? {}
        : {
            padding: '15px'
          },
      readOnly,
      autoFocus: !readOnly
    }),
    [readOnly]
  )

  // We get memoized plugins
  const plugins = useMemo(
    () => generatePlugins(readOnly ? editorPreviewComponents : components, { exclude: { dnd: true } }),
    [readOnly]
  )

  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { focusBlock } = useFocusBlock()

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId, { exclude: { dnd: true, mentions: true } })

  const newPlugins = [
    ...plugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        // mog('editorPreviewRenderer', { blockId, editorId })
        focusBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId, content])

  const onDelayPerform = debounce(!readOnly && typeof onChange === 'function' ? onChange : () => undefined, 200)

  useEditorChange(editorId, content)

  const onContentChange = (val: NodeEditorContent) => {
    if (onChange) onDelayPerform(val)
  }

  return (
    <>
      <PreviewStyles
        noMouseEvents={noMouseEvents}
        onClick={(ev) => {
          if (onClick) onClick(ev)
          if (onDoubleClick && ev.detail === 2) {
            onDoubleClick(ev)
          }
        }}
      >
        <FadeContainer fade={blockId !== undefined}>
          <Plate
            id={editorId}
            editableProps={editableProps}
            onChange={onContentChange}
            initialValue={content}
            plugins={newPlugins}
          >
            {!readOnly && <MultiComboboxContainer config={comboConfigData} />}
          </Plate>
        </FadeContainer>
      </PreviewStyles>
    </>
  )
}

export default EditorPreviewRenderer
