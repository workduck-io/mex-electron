import { getCurrentTimeString } from '../../../utils/time'

export const getNewDraftKey = (): string => {
  const currentTime: string = getCurrentTimeString('ll LTS')

  return `Draft.${currentTime}`
}
