import { SEPARATOR } from '../../../components/mex/Sidebar/treeUtils'
import { DRAFT_NODE, DRAFT_PREFIX } from '../../../data/Defaults/idPrefixes'
import { getCurrentTimeString } from '../../../utils/time'

export const getNewDraftKey = (): string => {
  // Mar 16, 2022 10:24:29 PM
  const currentTime: string = getCurrentTimeString('PPpp')

  return `${DRAFT_PREFIX}${SEPARATOR}${currentTime}`
}

export const getUntitledDraftKey = (): string => {
  return getUntitledKey(DRAFT_PREFIX)
}

export const getUntitledKey = (parent: string): string => {
  return `${parent}${SEPARATOR}${DRAFT_NODE}`
}
