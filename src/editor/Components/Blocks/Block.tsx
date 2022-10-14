import React from 'react'

import useBlockStore, { BlockType } from '../../../store/useBlockStore'
import { BlockElement, BlockSelectorInput } from './styled'

type BlockProps = {
  blockId: string
  block: BlockType
  isEmpty?: boolean
  isBlock?: boolean
  children?: React.ReactElement | React.ReactElement[]
}

const Block: React.FC<BlockProps> = ({ children, blockId, block }) => {
  const [isSelected, setIsSelected] = React.useState(0)
  const addBlock = useBlockStore((store) => store.addBlock)
  const deleteBlock = useBlockStore((store) => store.deleteBlock)

  const handleBlockSelect = () => {
    if (!isSelected) {
      setIsSelected(1)
      addBlock(blockId, block)
    } else {
      setIsSelected(0)
      deleteBlock(blockId)
    }
  }

  return (
    <BlockElement contentEditable={false} id={blockId} key={`is-selected-${blockId}-${isSelected}`}>
      <BlockSelectorInput
        type="checkbox"
        checked={Boolean(isSelected)}
        // key={`is-selected-${blockId}-${isSelected}`}
        onClick={handleBlockSelect}
      />
      {children}
    </BlockElement>
  )
}

export default Block
