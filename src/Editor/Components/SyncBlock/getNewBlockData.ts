import { nanoid } from 'nanoid'
import { connection_services, SyncBlockData } from './SyncBlock.types'

export const getNewBlockData = (): SyncBlockData => {
  return {
    id: `BLOCK_${nanoid()}`,
    connections: connection_services as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    content: '',
  }
}
