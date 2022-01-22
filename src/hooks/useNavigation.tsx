import React from 'react'
import { useHistoryStore } from '../store/useHistoryStore'
import { useRecentsStore } from '../store/useRecentsStore'
import useLoad, { LoadNodeOptions } from './useLoad'

export const useNavigation = () => {
  // const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const { loadNode } = useLoad()
  const pushHs = useHistoryStore((store) => store.push)
  const replaceHs = useHistoryStore((store) => store.replace)
  const moveHs = useHistoryStore((store) => store.move)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const getCurrentUID = useHistoryStore((store) => store.getCurrentUId)

  const push = (uid: string, options?: LoadNodeOptions) => {
    pushHs(uid)
    addRecent(uid)
    loadNode(uid, options)
  }

  const replace = (uid: string) => {
    replaceHs(uid)
    addRecent(uid)
    loadNode(uid)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentUID()
    if (newId) {
      loadNode(newId)
      addRecent(newId)
    }
    return newId
  }

  return { push, move, replace }
}

// Used to wrap a class component to provide hooks
export const withNavigation = (Component: any) => {
  return function C2(props: any) {
    const { push, move } = useNavigation()

    return <Component push={push} move={move} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}