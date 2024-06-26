import create from 'zustand'

export type BlockMetaDataType = {
  source?: string // * NodeId or Website URL
  origin?: string
}

export type BlockType = {
  id: string
  children: BlockType[]
  type: string
  text?: string
  blockMeta?: BlockMetaDataType
}

export enum ContextMenuActionType {
  move = 'Move',
  send = 'Send'
}

export type ModalOpenType = ContextMenuActionType | undefined

export type BlockMode = {
  blocks: Record<string, BlockType>
  setBlocks: (blocks: Record<string, BlockType>) => void
  addBlock: (blockId: string, block: BlockType) => void
  deleteBlock: (blockId: string) => void
  getBlocks: () => Array<BlockType>
  isModalOpen: ModalOpenType
  setIsModalOpen: (isModalOpen: ModalOpenType) => void
  isBlockMode: boolean
  setIsBlockMode: (isBlockMode: boolean) => void
}

const useBlockStore = create<BlockMode>((set, get) => ({
  blocks: {},
  setBlocks: (blocks: Record<string, BlockType>) => set({ blocks }),
  addBlock: (blockId: string, block: BlockType) => {
    const blocks = get().blocks
    set({ blocks: { ...blocks, [blockId]: block } })
  },
  getBlocks: () => {
    const blocks = get().blocks
    return Object.values(blocks)
  },
  deleteBlock: (blockId: string) => {
    const blocks = get().blocks
    const newBlocks = { ...blocks }
    delete newBlocks[blockId]
    set({ blocks: newBlocks })
  },
  isModalOpen: undefined,
  setIsModalOpen: (isModalOpen: ModalOpenType) => set({ isModalOpen }),
  isBlockMode: false,
  setIsBlockMode: (isBlockMode: boolean) => {
    if (!isBlockMode) set({ blocks: {}, isBlockMode })
    else set({ isBlockMode })
  }
}))

export default useBlockStore
