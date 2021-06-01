import MexIcons from '../Icons';

export default interface TreeNode {
  title: string;
  id: string;
  key: string;
  path: string;
  mex_icon: keyof typeof MexIcons | undefined;
  children: TreeNode[];
}
