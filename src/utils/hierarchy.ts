import { differenceWith } from 'lodash'
import { ILink } from '../types/Types'

const compareIlinks = (a: ILink, b: ILink) => a.nodeid === b.nodeid && a.namespace === b.namespace

export const iLinksToUpdate = (oldHierarchy: ILink[], updatedHierarchy: ILink[]) => {
  const toUpdateLocal = differenceWith(updatedHierarchy, oldHierarchy, compareIlinks)
  const toUpdateCloud = differenceWith(oldHierarchy, updatedHierarchy, compareIlinks)
  return {
    toUpdateLocal,
    toUpdateCloud
  }
}
