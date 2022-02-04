export type ListItemType = {
  icon: string
  title: string
  description: string
  extras: Record<string, any>
  shortcut?: Array<string>
  type: 'ilink' | 'action'
  new?: boolean
}
