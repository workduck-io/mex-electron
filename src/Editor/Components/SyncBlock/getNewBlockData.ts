import { nanoid } from 'nanoid'
import { getCurrentTimeString } from '../../../Spotlight/utils/time'
import { connection_services, SyncBlockData } from './SyncBlock.types'

export const getNewBlockId = (): string => `BLOCK_${nanoid()}`

export const getNewDraftKey = (): string => {
  const currentTime: string = getCurrentTimeString('ll LTS')

  return `Draft.${currentTime}`
}

export const getNewBlockData = (templateId: string): SyncBlockData => {
  return {
    id: getNewBlockId(),
    intentGroupId: templateId,
    content: ''
  }
}
