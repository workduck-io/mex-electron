import { NodeLink } from '../../Types/relations'

export const doesLinkRemain = (id: string, refactored: NodeLink[]): boolean => {
  return refactored.map((r) => r.from).indexOf(id) === -1
}
