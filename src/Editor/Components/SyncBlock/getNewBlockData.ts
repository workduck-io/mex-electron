import { nanoid } from 'nanoid'
import { getCurrentTimeString } from '../../../Spotlight/utils/time'

export const getNewBlockId = (): string => `BLOCK_${nanoid()}`

export const getNewDraftKey = (): string => {
  const currentTime: string = getCurrentTimeString('ll LTS')

  return `Draft.${currentTime}`
}
