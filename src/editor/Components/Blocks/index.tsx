import { usePlateEditorRef, PlateRenderElementProps, createNodesHOC } from '@udecode/plate-core'
import useBlockStore, { BlockType } from '../../../store/useBlockStore'

import Block from './Block'
import React, { useMemo } from 'react'
import { findNodePath } from '@udecode/plate'

const BlockOptions = (props: PlateRenderElementProps) => {
  const { children, element } = props

  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const editor = usePlateEditorRef()
  // const theme = useTheme()
  // const selected = useSelected()
  // const { isFlowBlock } = useTransform()

  // const elementStyles = {
  //   borderRadius: theme.borderRadius.tiny,
  //   margin: '4px 0',
  //   backgroundColor:
  //     selected && !isCollapsed(editor.selection) && transparentize(0.05, theme.colors.background.highlight)
  // }

  const isBlock = useMemo(() => {
    const isThisBlock = element && editor && findNodePath(editor, element)?.length === 1

    return isThisBlock
  }, [editor, element, isBlockMode])

  if (!element || !isBlockMode || !isBlock) return children

  return (
    <Block blockId={element?.id} block={element as BlockType}>
      {children}
    </Block>
  )
}

export default BlockOptions

export const withBlockOptions = createNodesHOC(BlockOptions)
