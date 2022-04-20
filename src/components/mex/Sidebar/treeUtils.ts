import MexIcons from '../../../components/icons/Icons'
import { GetIcon } from '../../../data/links'
import TreeNode from '../../../types/tree'

export const sampleFlatTree = [
  '@',
  'docs',
  'dev',
  'dev.big',
  'dev.big.small',
  'dev.git',
  'dev.js',
  'pro',
  'pro.mex',
  'pro.mex.issues',
  'com',
  'com.workduck'
]

export const SEPARATOR = '.'

export const getParentId = (id: string) => {
  const lastIndex = id.lastIndexOf(SEPARATOR)
  if (lastIndex === -1) return null
  return id.slice(0, lastIndex)
}

/** Also includes the ID of the final node */
/**
    id = a.b.c
    link = [a b c]
    a, a.b, a.b.c
  */
export const getAllParentIds = (
  id: string // const allParents: string[] = []
) =>
  id
    .split(SEPARATOR) // split by `.`
    .reduce(
      // Use prefix of last element when the array has elements
      (p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${SEPARATOR}${c}` : c],
      []
    )

//
// let past = ''
// id.split(SEPARATOR).forEach((s) => {
//   const link = past === '' ? s : `${past}${SEPARATOR}${s}`
//   allParents.push(link)
//   past = link
// })
// return allParents

export const isElder = (id: string, xparent: string) => {
  return id.startsWith(xparent + SEPARATOR)
}

export const isParent = (id: string, parent: string) => {
  return getParentId(id) === parent
}

export const isTopNode = (id: string) => {
  return getParentId(id) === null
}

export const getNameFromPath = (id: string) => {
  const split = id.split(SEPARATOR)
  if (split.length > 1) return split[split.length - 1]
  return id
}
// export default generateTree(sampleFlatTree)
