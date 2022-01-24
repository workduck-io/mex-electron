/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react'
import { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw-next/types/types'
import { setNodes } from '@udecode/plate-core'
import { getRootProps } from '@udecode/plate-styled-components'
import { ReactEditor } from 'slate-react'
import { TExcalidrawProps } from '../../types'
import { getExcalidrawElementStyles } from './ExcalidrawElement.styles'
import { ExcalidrawElementProps } from './ExcalidrawElement.types'
import { debounce } from 'lodash'
import { serializeAsJSON } from '@excalidraw/excalidraw-next'
import { mog } from '../../../../../utils/lib/helper'

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

  useEffect(() => {
    import('@excalidraw/excalidraw-next').then((comp) => setExcalidraw(comp.default))
  })

  const styles = getExcalidrawElementStyles(props)
  const _excalidrawRef = useRef<ExcalidrawImperativeAPI>(null)

  const excProps = _excalidrawProps || {}

  const desData = JSON.parse(element?.value ?? '{}')

  mog('Excali props; ', { desData, element })

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

        if (props.editor) {
          const serializedData = serializeAsJSON(elements, state)
          setNodes(props.editor, {
            value: serializedData,
            at: path
          })
        }
      } catch (e) {
        console.error(e)
      }
    }, 1000),
    ...excProps
  }

  return (
    <div {...attributes} {...rootProps}>
      <div contentEditable={false}>
        <div
          style={{ height: '600px' }}
          css={styles.excalidrawWrapper?.css}
          className={styles.excalidrawWrapper?.className}
        >
          {Excalidraw && <Excalidraw {...nodeProps} {...(excalidrawProps as any)} />}
        </div>
      </div>
      {children}
    </div>
  )
}
