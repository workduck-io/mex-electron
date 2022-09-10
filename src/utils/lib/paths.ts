import toast from 'react-hot-toast'

import { BreadcrumbItem } from '@workduck-io/mex-components'

import {
  getAllParentIds,
  getNameFromPath,
  getParentFromPath,
  isElder,
  SEPARATOR
} from '../../components/mex/Sidebar/treeUtils'
import { BASE_DRAFT_PATH, BASE_MEETING_PATH, BASE_TASKS_PATH } from '../../data/Defaults/baseData'
import { FlowCommandPrefix } from '../../editor/Components/SlashCommands/useSyncConfig'
import { SnippetCommandPrefix } from '../../hooks/useSnippets'
import { ILink, SingleNamespace } from '../../types/Types'
import { mog } from './helper'

const RESERVED_PATHS: string[] = [
  BASE_DRAFT_PATH,
  BASE_TASKS_PATH,
  FlowCommandPrefix,
  'mex',
  SnippetCommandPrefix,
  BASE_MEETING_PATH,
  'sync',
  'root'
]

export const RESERVED_NAMESPACES = {
  default: 'Personal',
  shared: 'Shared'
}

export const SHARED_NAMESPACE: SingleNamespace = {
  id: 'NAMESPACE_shared',
  name: RESERVED_NAMESPACES.shared,
  createdAt: 0,
  updatedAt: 0,
  icon: { type: 'ICON', value: 'mex:shared-note' }
}

export const getNewNamespaceName = (num: number): string => {
  return `Space ${num}`
}

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

export const isClash = (path: string, paths: string[]) => paths.includes(path)

export const isReservedOrClash = (path: string, paths: string[]) => {
  return isReserved(path) || isClash(path, paths)
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
export const getUniquePath = (
  path: string,
  paths: string[],
  showNotification = true
): { unique: string } | undefined => {
  // Is path reserved
  if (isReserved(path)) {
    return undefined
  }

  // Is path is already present (Clash)
  // mog('GET UNIQUE PATH', { path, paths })

  if (paths.includes(path)) {
    let newPath = getPathNum(path)
    while (paths.includes(newPath)) {
      newPath = getPathNum(newPath)
      mog('NEW PATH', { newPath })
    }
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

/*
 * Checks if a path is same or a child of given testPath
 */
export const isMatch = (path: string, testPath: string) => {
  if (testPath === path) return true
  if (path.startsWith(testPath + SEPARATOR)) return true
}

type GetPath = (item) => string

export const findParent = <T>(
  parentPath: string,
  groupedItems: PartialTreeItem<T>[],
  getPath: GetPath
): PartialTreeItem<T> | undefined => {
  // items have children
  if (groupedItems.length > 0) {
    // find the parent
    for (const item of groupedItems) {
      const path = getPath(item)
      if (path === parentPath) return item
      if (item.stub === true && item.path === parentPath) return item
      if (isElder(parentPath, path)) {
        const parent = findParent(parentPath, item.children ?? [], getPath)
        if (parent) return parent as T
      }
    }
    // groupedItems.forEach((item) => {
    // })
  }
  return
}

interface PartialTreeItem<K> {
  item?: K
  stub?: boolean
  path?: string
  children?: PartialTreeItem<K>[]
}

/**
 * Get items with path grouped by path
 * Grouping goes 1 level deep only
 *
 * Stubs are added for if parents are missing
 */
export const getPartialTreeGroups = <T>(
  items: T[],
  getPath: GetPath,
  sortBy: (a: T, b: T) => number
): PartialTreeItem<T>[] => {
  const groupedPaths = items.reduce((acc, item) => {
    const path = getPath(item)
    // The parent's path
    const pathGroup = getParentFromPath(path)

    if (acc[pathGroup]) {
      acc[pathGroup].push(item)
    } else {
      acc[pathGroup] = [item]
    }
    return acc
  }, {} as { [key: string]: T[] })

  const itemArrayGrouped = Object.keys(groupedPaths)
    .reduce((acc, key) => {
      acc.push(...groupedPaths[key])
      return acc
    }, [] as T[])
    .sort(sortBy)

  // const itemsInsertedInParent: T[] =
  const toGroupItems = [...itemArrayGrouped] //.reverse()
  const groupedItems: PartialTreeItem<T>[] = []
  toGroupItems.forEach((item) => {
    const path = getPath(item)
    const parentPath = getParentFromPath(path)
    if (parentPath) {
      // mog('getPartialTreeGroups', { data: JSON.stringify({ path, item, parentPath, groupedItems }, null, 2) })
      const parent = findParent(parentPath, groupedItems, getPath)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push({ item })
      } else {
        const stubParent = { path: parentPath, stub: true, children: [item] }
        groupedItems.push(stubParent)
      }
    } else {
      // mog('getPartialTreeGroups NoParent', { path, item, parentPath, groupedItems })
      groupedItems.push(item)
    }
  })

  mog('getPartialTreeGroups', { groupedPaths, itemArrayGrouped, toGroupItems, groupedItems })

  return groupedItems
}

export const getParentBreadcurmbs = (path: string, nodes: ILink[]) => {
  const allParents = getAllParentIds(path)

  const parents: BreadcrumbItem[] = allParents.reduce((val, p) => {
    const parentNode = nodes.find((l) => l.path === p)
    if (parentNode) {
      return [
        ...val,
        {
          id: parentNode.nodeid,
          icon: parentNode.icon ?? 'ri:file-list-2-line',
          label: getNameFromPath(parentNode.path)
        }
      ]
    }
    return val
  }, [])

  return parents
}
