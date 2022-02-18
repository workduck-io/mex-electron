import React from 'react'
import useDataStore from '../store/useDataStore'
import { useHistoryStore } from '../store/useHistoryStore'
import { useRecentsStore } from '../store/useRecentsStore'
import { ILink } from '../types/Types'
import { isMatch } from '../utils/lib/paths'
import useArchive from './useArchive'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const linkCache = useDataStore((state) => state.linkCache)
  const tagsCache = useDataStore((state) => state.tagsCache)
  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const updateInternalLinks = useDataStore((state) => state.updateInternalLinks)

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
      const match = isMatch(i.path, del)
      return match
    })

    const newIlinks = ilinks.filter((i) => archivedNodes.map((i) => i.path).indexOf(i.path) === -1)

    return { archivedNodes, newIlinks }
  }

  const execDelete = (del: string) => {
    const { archivedNodes, newIlinks } = getMockDelete(del)

    addArchiveData(archivedNodes)

    // Update history
    const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, newIlinks)
    updateHistory(newHistory, newCurIndex)

    // Update Recents
    const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, newIlinks)
    updateLastOpened(newRecents)

    const baseId = archivedNodes.map((item) => item.path).indexOf(useDataStore.getState().baseNodeId)

    if (baseId !== -1 && newIlinks.length > 0) {
      setBaseNodeId(newIlinks[0].path)
    }

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
