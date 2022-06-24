import React, { useCallback } from 'react'
import { NavigationType, ROUTE_PATHS, useRouting } from '../views/routes/urls'
import { useHistoryStore } from '../store/useHistoryStore'
import { useRecentsStore } from '../store/useRecentsStore'
import useLoad, { LoadNodeOptions } from './useLoad'
import { mog } from '../utils/lib/helper'

export const useNavigation = () => {
  // const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const { loadNode } = useLoad()
  const pushHs = useHistoryStore((store) => store.push)
  const replaceHs = useHistoryStore((store) => store.replace)
  const moveHs = useHistoryStore((store) => store.move)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const { goTo } = useRouting()
  const getDistanceNodeid = useHistoryStore((store) => store.getDistanceNodeid)

  const push = (nodeid: string, options?: LoadNodeOptions) => {
    pushHs(nodeid)
    addRecent(nodeid)
    loadNode(nodeid, options)
  }

  const replace = (nodeid: string) => {
    replaceHs(nodeid)
    addRecent(nodeid)
    loadNode(nodeid)
  }

  const move = (dist: number) => {
    const newId = getDistanceNodeid(dist)
    if (newId) {
      moveHs(dist)
      mog('Moving', { dist, newId })
      loadNode(newId)
      addRecent(newId)
      goTo(ROUTE_PATHS.node, NavigationType.push, newId)
    }
    return newId
  }

  return { push, move, replace }
}

// Used to wrap a class component to provide hooks
export const withNavigation = (Component: any) => {
  return function C2(props: any) {
    const { push, move } = useNavigation()
    const { goTo } = useRouting()

    const onPush = useCallback((nodeid: string, options?: LoadNodeOptions) => {
      console.log('onPush', { nodeid, options })
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
      push(nodeid, options)
    }, [])

    return <Component push={onPush} move={move} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
