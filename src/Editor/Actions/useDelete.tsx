import React from 'react'
import { Contents, useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'
import { useHistoryStore } from '../Store/HistoryStore'
import { useRecentsStore } from '../Store/RecentsStore'
import { ILink } from '../Store/Types'
import { getUidFromNodeIdAndLinks } from './useLinks'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)
  const setBaseNodeId = useDataStore((state) => state.setBaseNodeId)

  const historyStack = useHistoryStore((state) => state.stack)
  const currentIndex = useHistoryStore((state) => state.currentNodeIndex)
  const updateHistory = useHistoryStore((state) => state.update)

  const lastOpened = useRecentsStore((state) => state.lastOpened)
  const updateLastOpened = useRecentsStore((state) => state.update)

  const getMockDelete = (del: string): string[] => {
    const deleteMap = ilinks.filter((i) => {
      const match = i.text.startsWith(del)
      return match
    })

    const deleted = deleteMap.map((f) => {
      return f.text
    })

    return deleted
  }

  const execDelete = (del: string) => {
    const deleted = getMockDelete(del)

    // Generate the links without deleted ones
    const newIlinks = ilinks.filter((i) => {
      return deleted.indexOf(i.text) === -1
    })

    // Remap the contents for links that remain
    const newContents: Contents = {}
    newIlinks.forEach((l) => {
      const uid = getUidFromNodeIdAndLinks(newIlinks, l.text)
      newContents[uid] = contents[uid]
    })

    const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, newIlinks)
    updateHistory(newHistory, newCurIndex)

    const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, newIlinks)
    updateLastOpened(newRecents)

    const baseId = deleted.indexOf(useDataStore.getState().baseNodeId)
    if (baseId !== -1 && newIlinks.length > 0) {
      setBaseNodeId(newIlinks[0].text)
    }
    setILinks(newIlinks)
    initContents(newContents)

    return { deleted, newLinks: newIlinks }
  }

  return { getMockDelete, execDelete }
}

const applyDeleteToIds = (ids: string[], currentIndex: number, newIlinks: ILink[]) => {
  const curIndexOffset = 0
  const newIds: string[] = []

  ids.forEach((uid) => {
    const isPresent = newIlinks.some((l) => l.uid === uid)
    if (!isPresent) {
      newIds.push(uid)
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
