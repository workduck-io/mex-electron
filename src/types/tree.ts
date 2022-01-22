import MexIcons from '../components/icons/Icons'

export default interface TreeNode {
  title: string
  id: string
  uid: string
  key: string
  mex_icon: keyof typeof MexIcons | undefined
  children: TreeNode[]
}
