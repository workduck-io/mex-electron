import { nanoid } from 'nanoid'
import { getCurrentTimeString } from '../../../Spotlight/utils/time'
import { connection_services, SyncBlockData } from './SyncBlock.types'

export const getNewBlockId = (): string => `BLOCK_${nanoid()}`

export const getNewDraftKey = (): string => {
  const currentTime: string = getCurrentTimeString('ll LTS')

  return `Draft.${currentTime}`
}

export const getNewBlockData = (): SyncBlockData => {
  return {
    id: getNewBlockId(),
    connections: connection_services as any,
    content: '',
  }
}
