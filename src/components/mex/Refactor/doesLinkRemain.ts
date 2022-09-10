import { NodeLink } from '../../../types/relations'
import { ILink } from '../../../types/Types'

export const doesLinkRemain = (id: string, refactored: ILink[]): boolean => {
  return refactored.map((r) => r.path).indexOf(id) === -1
}

export const linkInRefactor = (id: string, refactored: NodeLink[]): false | NodeLink => {
  const index = refactored.map((r) => r.from).indexOf(id)
  if (index === -1) return false
  else return refactored[index]
}
