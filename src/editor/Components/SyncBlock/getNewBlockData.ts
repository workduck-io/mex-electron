import { getCurrentTimeString } from '../../../utils/time'

export const getNewDraftKey = (): string => {
  // Mar 16, 2022 10:24:29 PM
  const currentTime: string = getCurrentTimeString('PPpp')

  return `Draft.${currentTime}`
}
