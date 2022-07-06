import { createNodesHOC, useEditorState } from '@udecode/plate-core'
import useBlockStore, { BlockType } from '../../../store/useBlockStore'
import { ReactEditor } from 'slate-react'

import Block from './Block'
import { BlockOptionProps } from './types'
import React, { memo, useMemo } from 'react'

const BlockOptions = (props: BlockOptionProps) => {
  const { children, element } = props

  const isBlockMode = useBlockStore((store) => store.isBlockMode)

  // const theme = useTheme()
  // const selected = useSelected()
  const editor = useEditorState()
  // const { isFlowBlock } = useTransform()

  // const elementStyles = {
  //   borderRadius: theme.borderRadius.tiny,
  //   margin: '4px 0',
  //   backgroundColor:
  //     selected && !isCollapsed(editor.selection) && transparentize(0.05, theme.colors.background.highlight)
  // }

  const path = useMemo(
    () => element && isBlockMode && ReactEditor.findPath(editor, element),
    [editor, isBlockMode, element]
  )

  const isBlock = path?.length === 1

  // const isFlowLinkPresent = element && isFlowBlock(element)

  if (!element || !isBlockMode || !isBlock)
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        className: child.props.className,
        nodeProps: {
          ...props.nodeProps
        }
      })
    })

  return (
    <Block blockId={element?.id} block={element as BlockType}>
      {children}
    </Block>
  )
}

export const withBlockOptions = createNodesHOC(memo(BlockOptions))
