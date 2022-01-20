import TreeNode from '../../types/tree'

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
