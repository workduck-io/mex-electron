import { getCurrentTimeString } from '../../../Spotlight/utils/time'

export const getNewDraftKey = (): string => {
  const currentTime: string = getCurrentTimeString('ll LTS')

  return `Draft.${currentTime}`
}
