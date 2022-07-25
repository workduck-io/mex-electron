import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import sendToIcon from '@iconify/icons-ph/arrow-bend-up-right-bold'
import moveToIcon from '@iconify/icons-ri/anticlockwise-2-fill'
import { Icon } from '@iconify/react'
import { getPlateEditorRef, usePlateEditorRef } from '@udecode/plate'
import React from 'react'
import { Item } from 'react-contexify'
import toast from 'react-hot-toast'
import useBlockStore, { ContextMenuActionType } from '../../../store/useBlockStore'
import { StyledMenu } from '../../../style/Menu'
import { useTransform } from '../BalloonToolbar/components/useTransform'
import { useEditorBlockSelection } from '@editor/Actions/useEditorBlockSelection'

type BlockOptionsProps = {
  blockId: string
}

export const MENU_ID = 'block-options-menu'

export const BlockOptionsMenu: React.FC<BlockOptionsProps> = () => {
  const { isConvertable } = useTransform()
  const setBlocks = useBlockStore((store) => store.setBlocks)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const { convertToBlocks, deleteSelectedBlock } = useEditorBlockSelection()

  const setBlocksFromSelection = () => {
    const blocks = convertToBlocks()
    setBlocks(blocks)
  }

  const handleDelete = () => {
    deleteSelectedBlock()
    setIsModalOpen(undefined)
  }

  const onSendToClick = (item: any) => {
    const editor = getPlateEditorRef()

    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return
    }

    setBlocksFromSelection()
    setIsModalOpen(ContextMenuActionType.send)
  }

  const onMoveToClick = (item: any) => {
    const editor = getPlateEditorRef()

    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return false
    }
    setBlocksFromSelection()
    setIsModalOpen(ContextMenuActionType.move)
  }

  const onDeleteClick = (item: any) => {
    handleDelete()
  }

  return (
    <StyledMenu id={MENU_ID}>
      <Item id="send-to" onClick={onSendToClick}>
        <Icon icon={sendToIcon} />
        Send
      </Item>
      <Item id="move-to" onClick={onMoveToClick}>
        <Icon icon={moveToIcon} />
        Move
      </Item>
      <Item id="move-to" onClick={onDeleteClick}>
        <Icon icon={deleteBin6Line} />
        Delete
      </Item>
    </StyledMenu>
  )
}
