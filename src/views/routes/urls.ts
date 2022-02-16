import { useHistory } from 'react-router-dom'

export const ROUTE_PATHS = {
  dashborad: '/',
  login: '/login',
  register: '/register',
  archive: '/archive',
  tag: '/tag', // * /tag/:tag
  node: '/node', // * /node/:nodeid
  search: '/search',
  settings: '/settings',
  tasks: '/tasks',
  integrations: '/integrations',
  snippets: '/snippets',
  snippet: '/snippets/node' // * /snippets/node/:snippetid
}

export enum NavigationType {
  push,
  replace
}

export const useRouting = () => {
  const history = useHistory()

  const goTo = (basePath: string, type: NavigationType, id?: string) => {
    const path = id ? `${basePath}/${id}` : basePath

    if (type === NavigationType.push) history.push(path)

    if (type === NavigationType.replace) history.replace(path)
  }

  return { goTo }
}
