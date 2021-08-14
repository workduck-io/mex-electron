import TreeNode from '../../Types/tree';

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
  'com.workduck',
];

export const SEPARATOR = '.';

export const getParentId = (id: string) => {
  const lastIndex = id.lastIndexOf(SEPARATOR);
  if (lastIndex === -1) return null;
  return id.slice(0, lastIndex);
};

export const isElder = (id: string, xparent: string) => {
  return id.startsWith(xparent + SEPARATOR);
};

export const isParent = (id: string, parent: string) => {
  return getParentId(id) === parent;
};

export const isTopNode = (id: string) => {
  return getParentId(id) === null;
};

export const getNodeIdLast = (id: string) => {
  const split = id.split(SEPARATOR);
  if (split.length > 1) return split[split.length - 1];
  return id;
};

const createChildLess = (n: string): TreeNode => ({
  id: n,
  title: n,
  key: n,
  mex_icon: undefined,
  children: [],
});

// Insert the given node in a nested tree
const insertInNested = (iNode: TreeNode, nestedTree: TreeNode[]) => {
  const newNested = [...nestedTree];

  newNested.forEach(n => {
    const index = newNested.indexOf(n);
    if (index > -1) {
      if (isElder(iNode.id, n.id)) {
        let children: TreeNode[];
        if (isParent(iNode.id, n.id)) {
          children = [...n.children, iNode];
        } else {
          children = insertInNested(iNode, n.children);
        }
        // console.log({ children });
        newNested.splice(index, 1, {
          ...n,
          children,
        });
      }
    }
  });

  return newNested;
};

// Generate nested node tree from a list of ordered id strings
export const generateTree = (tree: string[]) => {
  // tree should be sorted
  let nestedTree: TreeNode[] = [];
  tree.forEach(n => {
    const parentId = getParentId(n);
    if (parentId === null) {
      // add to tree first level
      nestedTree.push(createChildLess(n));
    } else {
      // Will have a parent
      nestedTree = insertInNested(createChildLess(n), nestedTree);
    }
  });
  return nestedTree;
};

export default generateTree(sampleFlatTree);
