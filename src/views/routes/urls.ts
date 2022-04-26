import { useEffect } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { mog } from '../../utils/lib/helper'
import { useKeyListener } from '../../hooks/useShortcutListener'
import { useHelpStore } from '../../store/useHelpStore'
import { useRecentsStore } from '../../store/useRecentsStore'
import tinykeys from 'tinykeys'
import { useNavigation } from '../../hooks/useNavigation'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../data/IpcAction'
import useLoad from '../../hooks/useLoad'
import { useEditorStore } from '../../store/useEditorStore'
import useDataStore from '../../store/useDataStore'

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
  snippet: '/snippets/node', // * /snippets/node/:snippetid
  forgotpassword: '/forgotpassword'
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

export const useBrowserNavigation = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()
  const { move, push } = useNavigation()
  const { loadNode } = useLoad()
  const addRecent = useRecentsStore((store) => store.addRecent)
  // const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const node = useEditorStore.getState().node
    const initialized = useDataStore.getState().initialized

    if (!initialized) return

    if (node && location && location.pathname) {
      if (node.nodeid) {
        const nodeid = location.pathname.split('/')[2]
        if (nodeid && nodeid !== node.nodeid) {
          mog('Navigation reloaded', { nodeid, location, node })
          loadNode(nodeid)
          addRecent(nodeid)
        }
      }
    }
  }, [location])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.gotoBackwards.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoBackwards, () => {
          console.log('NavigateBack', { location, path: location.pathname })
          if (location.pathname.startsWith(ROUTE_PATHS.node)) {
            // move(-1)
          }

          ipcRenderer.send(IpcAction.GO_BACK)
          // navigate(-1)
        })
      },
      [shortcuts.gotoForward.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoForward, () => {
          console.log('NavigateForward', { location, path: location.pathname })
          if (location.pathname.startsWith(ROUTE_PATHS.node)) {
            // move(+1)
          }
          ipcRenderer.send(IpcAction.GO_FORWARD)
          // move(1)
          // navigate(+1)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   console.log('BrowserNavigation', { location })
  // }, [location])
}
