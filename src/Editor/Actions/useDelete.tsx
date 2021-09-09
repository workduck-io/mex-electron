import React from 'react'
import { useNavigationState } from '../../Hooks/useNavigation/useNavigation'
import { Contents, useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)

  const historyStack = useNavigationState((state) => state.history.stack)
  const currentIndex = useNavigationState((state) => state.history.currentNodeIndex)
  const updateHistory = useNavigationState((state) => state.history.update)

  const lastOpened = useNavigationState((state) => state.recents.lastOpened)
  const updateLastOpened = useNavigationState((state) => state.recents.update)

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
      newContents[l.text] = contents[l.text]
    })

    const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, deleted)
    updateHistory(newHistory, newCurIndex)

    const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, deleted)
    updateLastOpened(newRecents)

    setILinks(newIlinks)
    initContents(newContents)

    return { deleted, newLinks: newIlinks }
  }

  return { getMockDelete, execDelete }
}

const applyDeleteToIds = (ids: string[], currentIndex: number, deleted: string[]) => {
  let curIndexOffset = 0
  const newIds: string[] = []

  ids.forEach((id, index) => {
    let isDeleted = false
    for (const d of deleted) {
      if (d === id) {
        isDeleted = true
        if (index <= currentIndex) {
          curIndexOffset -= 1
        }
      }
    }
    if (!isDeleted) {
      newIds.push(id)
    }
  })

  return { newIds, currentIndex: currentIndex + curIndexOffset }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withDelete = (Component: any) => {
  return function C2 (props: any) {
    const { getMockDelete, execDelete } = useDelete()

    return <Component getMockDelete={getMockDelete} execDelete={execDelete} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
