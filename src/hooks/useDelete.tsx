import React from 'react'
import { mog } from '../utils/lib/helper'
import useDataStore from '../store/useDataStore'
import { useHistoryStore } from '../store/useHistoryStore'
import { useRecentsStore } from '../store/useRecentsStore'
import { ILink } from '../types/Types'
import useArchive from './useArchive'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)

  const setILinks = useDataStore((state) => state.setIlinks)
  const setBaseNodeId = useDataStore((state) => state.setBaseNodeId)

  const historyStack = useHistoryStore((state) => state.stack)
  const currentIndex = useHistoryStore((state) => state.currentNodeIndex)
  const updateHistory = useHistoryStore((state) => state.update)

  const lastOpened = useRecentsStore((state) => state.lastOpened)
  const updateLastOpened = useRecentsStore((state) => state.update)
  const { addArchiveData } = useArchive()

  const getMockDelete = (del: string) => {
    const archivedNodes = ilinks.filter((i) => {
      const match = i.path.startsWith(del)
      return match
    })

    const newIlinks = ilinks.filter((i) => archivedNodes.map((i) => i.path).indexOf(i.path) === -1)

    return { archivedNodes, newIlinks }
  }

  const execDelete = (del: string, options?: { permanent: boolean }) => {
    const { archivedNodes, newIlinks } = getMockDelete(del)

    if (!options?.permanent) {
      addArchiveData(archivedNodes)
    }

    // Remap the contents for links that remain

    const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, newIlinks)
    updateHistory(newHistory, newCurIndex)

    const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, newIlinks)
    updateLastOpened(newRecents)

    const baseId = archivedNodes.map((item) => item.path).indexOf(useDataStore.getState().baseNodeId)

    if (baseId !== -1 && newIlinks.length > 0) {
      setBaseNodeId(newIlinks[0].path)
    }
    mog('Executing delete: ', { newIlinks })
    setILinks(newIlinks)
    // initContents(newContents)

    return { archivedNodes, newLinks: newIlinks }
  }

  return { getMockDelete, execDelete }
}

const applyDeleteToIds = (ids: string[], currentIndex: number, newIlinks: ILink[]) => {
  const curIndexOffset = 0
  const newIds: string[] = []

  ids.forEach((nodeid) => {
    const isPresent = newIlinks.some((l) => l.nodeid === nodeid)
    if (!isPresent) {
      newIds.push(nodeid)
    }
  })

  return { newIds, currentIndex: currentIndex + curIndexOffset }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withDelete = (Component: any) => {
  // eslint-disable-next-line space-before-function-paren
  return function C2(props: any) {
    const { getMockDelete, execDelete } = useDelete()

    return <Component getMockDelete={getMockDelete} execDelete={execDelete} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
