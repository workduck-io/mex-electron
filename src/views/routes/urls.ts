import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { mog } from '../../utils/lib/helper'

export const ROUTE_PATHS = {
  home: '/',
  dashborad: '/dashboard',
  login: '/login',
  register: '/register',
  archive: '/archive',
  tag: '/tag', // * /tag/:tag
  node: '/node', // * /node/:nodeid
  search: '/search',
  settings: '/settings',
  tasks: '/tasks',
  reminders: '/reminders',
  integrations: '/integrations',
  snippets: '/snippets',
  snippet: '/snippets/node' // * /snippets/node/:snippetid
}

export enum NavigationType {
  push,
  replace
}

export const useRouting = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const goTo = (basePath: string, type: NavigationType, id?: string, query?: Record<string, any>) => {
    const path = id ? `${basePath}/${id}` : basePath
    const state = { from: location.pathname, ...query }

    if (type === NavigationType.push) navigate(path, { state })

    if (type === NavigationType.replace) navigate(path, { replace: true, state })
  }

  return { goTo, location, params }
}
