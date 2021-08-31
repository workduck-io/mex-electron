import { nanoid } from 'nanoid'
import { connection_services, SyncBlockData } from './SyncBlock.types'

export const getNewBlockId = (): string => `BLOCK_${nanoid()}`
export const getNewDraftKey = (): string => `Draft.${nanoid(8)}`

export const getNewBlockData = (): SyncBlockData => {
  return {
    id: getNewBlockId(),
    connections: connection_services as any,
    content: ''
  }
}
