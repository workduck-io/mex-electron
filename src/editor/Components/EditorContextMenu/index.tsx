import { getNodes, usePlateEditorRef } from '@udecode/plate'
import useBlockStore, { BlockType, ContextMenuActionType } from '../../../store/useBlockStore'

import { Icon } from '@iconify/react'
import { Item, Separator } from 'react-contexify'
import React from 'react'
import { StyledMenu } from '../../../style/Menu'
import toast from 'react-hot-toast'
import moveToIcon from '@iconify-icons/ri/anticlockwise-2-fill'
import sendToIcon from '@iconify-icons/fluent/slide-multiple-arrow-right-24-regular'

import { useTransform } from '../BalloonToolbar/components/useTransform'

type BlockOptionsProps = {
  blockId: string
}

export const MENU_ID = 'block-options-menu'

export const BlockOptionsMenu: React.FC<BlockOptionsProps> = () => {
  const editor = usePlateEditorRef()
  const { isConvertable } = useTransform()
  const setBlocks = useBlockStore((store) => store.setBlocks)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)

  const convertToBlocks = () => {
    const nodes = Array.from(
      getNodes(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    const blocks = value.reduce((prev: Record<string, BlockType>, current: BlockType) => {
      prev[current.id] = current
      return prev
    }, {})

    setBlocks(blocks)
  }

  const onSendToClick = (item: any) => {
    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return
    }
    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.send)
  }

  const onMoveToClick = (item: any) => {
    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return false
    }
    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.move)
  }

  return (
    <StyledMenu id={MENU_ID}>
      {/* <Item id="send-to" onClick={onSendToClick}>
        <Icon icon={sendToIcon} />
        Copy
      </Item>
      <Item id="move-to" onClick={onMoveToClick}>
        <Icon icon={moveToIcon} />
        Paste
      </Item>
      <Separator /> */}
      <Item id="send-to" onClick={onSendToClick}>
        <Icon icon={sendToIcon} />
        Send To
      </Item>
      <Item id="move-to" onClick={onMoveToClick}>
        <Icon icon={moveToIcon} />
        Move To
      </Item>
    </StyledMenu>
  )
}