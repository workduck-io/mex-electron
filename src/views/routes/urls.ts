import { useNavigate } from 'react-router-dom'

export const ROUTE_PATHS = {
  home: '/',
  dashborad: '/dashboard',
  login: '/login',
  register: '/register',
  archive: '/archive',
  tag: '/tag', // * /tag/:tag
  node: '/node', // * /node/:nodeid
  search: 'search',
  settings: 'settings',
  tasks: 'tasks',
  integrations: 'integrations',
  snippets: '/snippets',
  snippet: '/snippets/node' // * /snippets/node/:snippetid
}

export enum NavigationType {
  push,
  replace
}

export const useRouting = () => {
  const navigate = useNavigate()

  const goTo = (basePath: string, type: NavigationType, id?: string) => {
    const path = id ? `${basePath}/${id}` : basePath

    if (type === NavigationType.push) navigate(path)

    if (type === NavigationType.replace) navigate(path, { replace: true })
  }

  return { goTo }
}
