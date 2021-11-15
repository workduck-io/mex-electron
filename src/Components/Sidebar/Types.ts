export interface NavLinkData {
  path: string
  title: string
  icon?: React.ReactNode
  isComingSoon?: boolean
}

export type NavProps = {
  links: NavLinkData[]
}
