import { getNameFromPath, isElder, isParent, getParentId } from '../../components/mex/Sidebar/treeUtils'
import { Contents, useContentStore } from '../../store/useContentStore'
import TreeNode from '../../types/tree'
import { TreeData, TreeItem } from '@atlaskit/tree'
import { mog } from './helper'
import { NodeMetadata } from '../../types/data'

export const sortTree = (tree: TreeNode[], contents: Contents): TreeNode[] => {
  // const metadataList = Object.entries(contents).map(([k, v]) => v.metadata)

  const sorting = (a, b) => {
    const aMeta = contents[a.nodeid] && contents[a.nodeid].metadata ? contents[a.nodeid].metadata : {}
    const bMeta = contents[b.nodeid] && contents[b.nodeid].metadata ? contents[b.nodeid].metadata : {}
    if (aMeta.createdAt && bMeta.createdAt) {
      return bMeta.createdAt - aMeta.createdAt
    }
    if (aMeta.createdAt && !bMeta.createdAt) {
      return -1
    }
    if (bMeta.createdAt && !aMeta.createdAt) {
      return 1
    }
    return 0
  }

  const sortedTree = tree.sort((a, b) => sorting(a, b))

  tree.map((node) => {
    if (node.children) {
      node.children = sortTree(node.children, contents)
    }
  })

  return sortedTree
}

const createChildLess = (path: string, nodeid: string, id: string, icon?: string): TreeItem => ({
  id,
  hasChildren: false,
  isExpanded: false,
  isChildrenLoading: false,
  data: {
    title: getNameFromPath(path),
    nodeid,
    path,
    mex_icon: icon
  },
  children: []
})

// Insert the given node in a nested tree
const insertInNested = (iNode: BaseTreeNode, nestedTree: BaseTreeNode[]) => {
  const newNested = [...nestedTree]

  newNested.forEach((n) => {
    const index = newNested.indexOf(n)
    if (index > -1) {
      if (isElder(iNode.path, n.path)) {
        let children: BaseTreeNode[]
        if (isParent(iNode.path, n.path)) {
          children = [...n.children, iNode]
        } else {
          children = insertInNested(iNode, n.children)
        }
        // console.log({ children });
        newNested.splice(index, 1, {
          ...n,
          children
        })
      }
    }
  })

  return newNested
}

interface FlatItem {
  id: string
  nodeid: string
  icon?: string
}

const getItem = (treeFlat: FlatItem[], id: string): number | undefined => {
  const item = treeFlat.findIndex((n) => n.id === id)
  return item ? item : null
}

const getParentItemId = (path: string, treeData: TreeData): string | undefined => {
  const parentPath = getParentId(path)

  if (parentPath) {
    const parentItem = Object.entries(treeData.items).find(([_k, n]) => {
      return n.data.path === parentPath
    })
    // mog('parentPath', { parentPath, parentItem, treeData })
    if (parentItem) {
      return parentItem[0]
    }
  }
  return undefined
}

export const TREE_SEPARATOR = '-'

interface BaseTreeNode {
  path: string
  nodeid: string
  children: BaseTreeNode[]
  icon?: string
}

const getIdFromBaseNestedTree = (baseNestedTree: BaseTreeNode[], path: string): string | undefined => {
  if (!path) {
    return undefined
  }
  for (let i = 0; i < baseNestedTree.length; i++) {
    const node = baseNestedTree[i]
    if (!node) return undefined
    if (node.path === path) {
      return `${i + 1}`
    }
    // mog('node', { node, path, baseNestedTree })
    if (isElder(path, node.path)) {
      return `${i + 1}${TREE_SEPARATOR}${getIdFromBaseNestedTree(node.children, path)}`
    }
  }
  return undefined
}

export const sortBaseNestedTree = (baseNestedTree: BaseTreeNode[], metadata: Record<string, NodeMetadata>) => {
  const sorting = (a: BaseTreeNode, b: BaseTreeNode) => {
    const aMeta = metadata[a.nodeid]
    const bMeta = metadata[b.nodeid]
    if (aMeta && aMeta.createdAt && bMeta && bMeta.createdAt) {
      return bMeta.createdAt - aMeta.createdAt
    }
    if (aMeta && aMeta.createdAt && (!bMeta || !bMeta.createdAt)) {
      return -1
    }
    if (bMeta && bMeta.createdAt && (!aMeta || !aMeta.createdAt)) {
      return 1
    }
    return 0
  }
  const sortedTree = baseNestedTree.sort((a, b) => sorting(a, b))

  for (let i = 0; i < sortedTree.length; i++) {
    const node = sortedTree[i]
    if (node.children) {
      node.children = sortBaseNestedTree(node.children, metadata)
      sortedTree[i] = node
    }
  }

  return sortedTree
}

export const getBaseNestedTree = (flatTree: FlatItem[]): BaseTreeNode[] => {
  const metadata = useContentStore.getState().getAllMetadata()
  let baseNestedTree: BaseTreeNode[] = []

  flatTree.forEach((n) => {
    const parentId = getParentId(n.id)
    if (parentId === null) {
      // add to tree first level
      baseNestedTree.push({
        path: n.id,
        nodeid: n.nodeid,
        children: []
      })
    } else {
      // Will have a parent
      baseNestedTree = insertInNested(
        {
          path: n.id,
          nodeid: n.nodeid,
          children: []
        },
        baseNestedTree
      )
    }
  })

  const sortedBaseNestedTree = sortBaseNestedTree(baseNestedTree, metadata)

  mog('baseNestedTree', { baseNestedTree, sortedBaseNestedTree })

  return sortedBaseNestedTree
}

// Generate nested node tree from a list of ordered id strings
// Expanded - path of the nodes that are expanded in tree
// Note that id of FlatItem is the path
// And id of TreeItem is the index+1 in nested tree like `1-2-3`
export const generateTree = (treeFlat: FlatItem[], expanded: string[]): TreeData => {
  // tree should be sorted
  const baseNestedTree = getBaseNestedTree(treeFlat)
  const nestedTree: TreeData = {
    rootId: '1',
    items: {}
  }
  const rootItem = {
    id: '1',
    data: { title: 'root', path: 'root' },
    children: [],
    isExpanded: baseNestedTree.length > 0,
    isChildrenLoading: false,
    hasChildren: baseNestedTree.length > 0
  }

  for (let i = 0; i < treeFlat.length; i++) {
    const n = treeFlat[i]
    const parentPath = getParentId(n.id)
    // mog('hasParent', { parentId, n, i })
    if (parentPath === null) {
      // add to tree first level
      const newId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, n.id)}`
      // mog('does not Parent Internal', { parentPath, n, newId, i })
      nestedTree.items[newId] = {
        ...createChildLess(n.id, n.nodeid, newId, n.icon),
        isExpanded: expanded.includes(n.id)
      }
    } else {
      // Will have a parent
      const parentId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, parentPath)}`
      const parentItem = nestedTree.items[parentId]
      // mog('hasParent Internal', { parentId, parentItem, parentPath, n, i })
      if (parentItem) {
        // add to tree and update parent
        const newId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, n.id)}`
        // Order is important for rendering children
        parentItem.children.unshift(newId)
        parentItem.hasChildren = true
        nestedTree.items[parentId] = parentItem
        nestedTree.items[newId] = {
          ...createChildLess(n.id, n.nodeid, newId, n.icon),
          isExpanded: expanded.includes(n.id)
        }
      }
    }
  }

  baseNestedTree.forEach((n, i) => {
    rootItem.children.push(`1${TREE_SEPARATOR}${i + 1}`)
  })

  nestedTree.items['1'] = rootItem

  mog('nestedTree', { treeFlat, nestedTree })

  return nestedTree
}

const getFlatTree = (nestedTree: TreeNode[]) => {
  let newTree: TreeNode[] = []

  nestedTree.forEach((c) => {
    newTree.push({ ...c, children: [] })
    if (c.children.length > 0) {
      newTree = newTree.concat(getFlatTree(c.children))
    }
  })

  return newTree
}

type Value = {
  label: string
  value: string
}

export const getOptions = (flatTree: TreeNode[]): Value[] => {
  return flatTree.map((n) => ({ label: n.id, value: n.id }))
}

export const getNodeFlatTree = (id: string, flatTree: TreeNode[]) => {
  return flatTree.filter((n) => n.id === id)
}

export default getFlatTree
