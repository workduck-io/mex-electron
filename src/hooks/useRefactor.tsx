import React from 'react'
import { mog } from '../utils/lib/helper'
import { linkInRefactor } from '../components/mex/Refactor/doesLinkRemain'
import { getAllParentIds, SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { generateNodeUID } from '../data/Defaults/idPrefixes'
import useAnalytics from '../services/analytics'
import { CustomEvents } from '../services/analytics/events'
import { Contents, useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { useRefactorStore } from '../store/useRefactorStore'
import { NodeLink } from '../types/relations'
import { useEditorBuffer } from './useEditorBuffer'
import { getNodeIcon } from '../utils/lib/icons'

const isMatch = (id: string, from: string) => {
  if (from === id) return true
  if (id.startsWith(from + SEPARATOR)) return true
}

export const useRefactor = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  // const historyStack = useHistoryStore((state) => state.stack)
  // const updateHistory = useHistoryStore((state) => state.update)

  // const lastOpened = useRecentsStore((state) => state.lastOpened)
  // const updateLastOpened = useRecentsStore((state) => state.update)

  /*  Notes:
  We need to refactor all ilinks that match with the given regex and replace the initial regex with the refactorId

  Then we need to remap the contents to the new IDs.

  We will return two functions, first that returns the list of refactoring, the second function applies the refactoring

  getMockRefactor is used to get a preview of the links that will be refactored.
  execRefactor will apply the refactor action.
  */

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)
  const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)
  const { trackEvent } = useAnalytics()

  // const { q, saveQ } = useSaveQ()
  const { saveAndClearBuffer } = useEditorBuffer()

  /*
   * Returns a mock array of refactored paths
   * Also refactors children
   * from: the current path
   * to: the new changed path
   */
  const getMockRefactor = (from: string, to: string): NodeLink[] => {
    saveAndClearBuffer()
    // saveQ()
    const refactorMap = ilinks.filter((i) => {
      const match = isMatch(i.path, from)
      return match
    })

    const refactored = refactorMap.map((f) => {
      return {
        from: f.path,
        to: f.path.replace(from, to)
      }
    })

    console.log({ from, to, refactorMap, refactored })
    return refactored
  }

  const execRefactor = (from: string, to: string) => {
    trackEvent(CustomEvents.REFACTOR, { 'mex-from': from, 'mex-to': to })
    const refactored = getMockRefactor(from, to)

    mog('execRefactor', { from, to, refactored })

    // Generate the new links
    const newIlinks = ilinks.map((i) => {
      for (const ref of refactored) {
        if (ref.from === i.path) {
          return {
            ...i,
            path: ref.to,
            icon: getNodeIcon(ref.to)
          }
        }
      }
      return i
    })

    // mog('execRefactor', { from, to, newIlinks })
    const isInNewlinks = (l: string) => {
      const ft = newIlinks.filter((i) => i.path === l)
      return ft.length > 0
    }

    const newParents = refactored
      .map((r) => getAllParentIds(r.to))
      .flat()
      .filter((x) => !isInNewlinks(x))

    const newParentIlinks = newParents.map((p) => ({
      path: p,
      nodeid: generateNodeUID(),
      icon: getNodeIcon(p)
    }))

    // console.log({ newIlinks, newParents, newParentIlinks })

    // Remap the contents with changed links
    const newContents: Contents = {}
    Object.keys(contents).forEach((key) => {
      const content = contents[key]
      if (content) {
        newContents[key] = { type: content.type ?? 'p', content: refactorLinksInContent(refactored, content.content) }
      }
    })

    // updateHistory(applyRefactorToIds(historyStack, refactored), 0)
    // updateLastOpened(applyRefactorToIds(lastOpened, refactored))

    // mog('execRefactor', { from, to, newIlinks: [...newIlinks, ...newParentIlinks], newContents })
    setILinks([...newIlinks, ...newParentIlinks])
    initContents(newContents)

    const baseId = linkInRefactor(useDataStore.getState().baseNodeId, refactored)
    if (baseId !== false) {
      setBaseNodeId(baseId.to)
    }

    // mog('baseId', { from, to, baseId, refactored })
    return refactored
  }

  return { getMockRefactor, execRefactor }
}

const refactorLinksInContent = (refactored: NodeLink[], content: any[]) => {
  const refMap: Record<string, string> = {}
  refactored.forEach((n) => (refMap[n.from] = n.to))

  if (!content) return []

  const newCont = content.map((n) => {
    if (n.type && n.type === 'ilink') {
      if (Object.keys(refMap).indexOf(n.value) !== -1) {
        return {
          ...n,
          value: refMap[n.value]
        }
      }
    }
    if (n.children && n.children.length > 0) {
      return { ...n, children: refactorLinksInContent(refactored, n.children) }
    }
    return n
  })
  return newCont
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withRefactor = (Component: any) => {
  return function C2(props: any) {
    const { getMockRefactor, execRefactor } = useRefactor()

    const prefillRefactorModal = useRefactorStore((state) => state.prefillModal)

    return (
      <Component
        getMockRefactor={getMockRefactor}
        execRefactor={execRefactor}
        prefillRefactorModal={prefillRefactorModal}
        {...props}
      />
    ) // eslint-disable-line react/jsx-props-no-spreading
  }
}

const applyRefactorToIds = (ids: string[], refactored: NodeLink[]) => {
  return ids.map((id) => {
    for (const ref of refactored) {
      if (ref.from === id) {
        return ref.to
      }
    }
    return id
  })
}
