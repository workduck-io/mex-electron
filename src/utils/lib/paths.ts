import toast from 'react-hot-toast'
import { mog } from './helper'

const RESERVED_PATHS: string[] = ['draft', 'tasks', 'flow', 'mex', 'sync']

export const getPathNum = (path: string) => {
  const numMatch = path.match(/\d+$/)
  // mog('getPathNum', { path, numMatch })
  if (numMatch) {
    const prevPathNum = path.match(/\d+$/)[0]
    return `${path.slice(0, path.length - prevPathNum.length)}${Number(prevPathNum) + 1}`
  } else {
    return `${path}-1`
  }
}

export const isReserved = (path: string) =>
  RESERVED_PATHS.reduce((p, c) => {
    if (c.toLowerCase() === path.toLowerCase()) {
      return true
    } else return p || false
  }, false)

export const isReservedOrClash = (path: string, paths: string[]) => {
  return isReserved(path) || paths.includes(path)
}
/*
 * Given a path and a set of pre existing paths, and pre defined reserved paths,
 * The function returns reserved: path if the path clashes
 *
 * Otherwise if it clashes with existing paths,
 * it adds or increments a numeric prefix to the path
 *
 * If there are no clashes it returns the original path as is.
 */
export const getUniquePath = (path: string, paths: string[], showNotification = true): { unique: string } | false => {
  // Is path reserved
  if (isReserved(path)) {
    return false
  }

  // Is path is already present (Clash)
  if (paths.includes(path)) {
    let newPath = getPathNum(path)
    while (paths.includes(newPath)) {
      newPath = getPathNum(newPath)
    }
    mog('Paths', { paths, newPath, isReserved })
    if (showNotification) toast('Path clashed with existing, incremented a numeric suffix')
    return { unique: newPath }
  }

  return { unique: path }
}

export const testing = () => {
  const tPs = ['sync', 'Sync', 'Sync', 'draft.1', 'Draft', 'newDraft', 'newDraftnew', 'Draft-1']
  const pPs = ['draft', 'draft.1', 'tasks', 'Draft-1', 'Draft-2']
  mog(`testing `, { tPs, pPs })

  tPs.forEach((p) => {
    const res = getUniquePath(p, pPs)
    const res2 = getPathNum(p)
    mog(`For path: ${p}`, { res, res2 })
  })
}
