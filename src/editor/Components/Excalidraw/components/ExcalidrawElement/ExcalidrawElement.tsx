/* eslint-disable import/no-unresolved */
import { serializeAsJSON } from '@excalidraw/excalidraw-next'
import { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw-next/types/types'
import fullscreenExitLine from '@iconify/icons-ri/fullscreen-exit-line'
import fullscreenLine from '@iconify/icons-ri/fullscreen-line'
import markupLine from '@iconify/icons-ri/markup-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { setNodes } from '@udecode/plate-core'
import { getRootProps } from '@udecode/plate-styled-components'
import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { ReactEditor } from 'slate-react'
import { mog } from '../../../../../utils/lib/helper'
import {
  InputPrompt,
  InputWrapper,
  RootElement
} from '../../../media-embed-ui/src/MediaEmbedElement/MediaEmbedElement.styles'
import { TExcalidrawProps } from '../../types'
import { CanvasText, getExcalidrawElementStyles } from './ExcalidrawElement.styles'

export const ExcalidrawElement = (props: any) => {
  const {
    attributes,
    children,
    nodeProps,
    element,
    scrollToContent = true,
    libraryItems = [],
    excalidrawProps: _excalidrawProps
  } = props

  const rootProps = getRootProps(props)

  const [Excalidraw, setExcalidraw] = useState<any>(null)
  const [max, setMax] = useState(false)

  useEffect(() => {
    import('@excalidraw/excalidraw-next').then((comp) => setExcalidraw(comp.default))
  }, [])

  const styles = getExcalidrawElementStyles(props)
  const _excalidrawRef = useRef<ExcalidrawImperativeAPI>(null)

  const excProps = _excalidrawProps || {}

  const desData = JSON.parse(element?.value ?? '{}')

  // mog('Excali props; ', { desData, element })

  const excalidrawProps: TExcalidrawProps = {
    excalidrawRef: _excalidrawRef,
    isCollaborating: false,
    initialData: {
      elements: desData?.elements,
      appState: desData?.state,
      scrollToContent,
      libraryItems
    },
    autoFocus: false,
    onChange: debounce((elements: readonly any[], state: AppState) => {
      try {
        const path = ReactEditor.findPath(props.editor, element)
        mog('PATH IS', { path, element })
        if (props.editor) {
          const serializedData = serializeAsJSON(elements, state)
          setNodes(
            props.editor,
            {
              value: serializedData
            },
            { at: path }
          )
        }
      } catch (e) {
        console.error(e)
      }
    }, 1000),
    ...excProps
  }

  return (
    <RootElement max={max} {...attributes} {...rootProps}>
      <div contentEditable={false}>
        <div
          style={{ height: max ? '86.5vh' : '600px' }}
          css={styles.excalidrawWrapper?.css}
          className={styles.excalidrawWrapper?.className}
        >
          {Excalidraw && <Excalidraw {...nodeProps} {...(excalidrawProps as any)} />}
        </div>
        <InputWrapper>
          <CanvasText>
            <Icon icon={markupLine} width={18} />
            Canvas
          </CanvasText>
          <Tippy
            theme="mex-bright"
            moveTransition="transform 0.25s ease-out"
            placement="right"
            content={max ? 'Minimize' : 'Maximize'}
          >
            <InputPrompt
              onClick={() => {
                setMax((i: boolean) => !i)
              }}
            >
              {max ? <Icon icon={fullscreenExitLine} height={18} /> : <Icon icon={fullscreenLine} height={18} />}
            </InputPrompt>
          </Tippy>
        </InputWrapper>
      </div>
      {children}
    </RootElement>
  )
}
