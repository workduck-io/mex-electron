import MexIcons from '../Icons'

export default interface TreeNode {
  title: string
  id: string
  uid: string
  key: string
  mex_icon: keyof typeof MexIcons | undefined
  children: TreeNode[]
}
