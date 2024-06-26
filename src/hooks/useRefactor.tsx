import React from 'react'

import { useApi } from '@apis/useSaveApi'
import { mog } from '@utils/lib/mog'

// import { useRefactorStore } from '../components/mex/Refactor/Refactor'
// import { linkInRefactor } from '../components/mex/Refactor/doesLinkRemain'
// import { getAllParentIds } from '../components/mex/Sidebar/treeUtils'
// import { generateNodeUID } from '../data/Defaults/idPrefixes'
// import useAnalytics from '../services/analytics'
// import { CustomEvents } from '../services/analytics/events'
import useDataStore from '../store/useDataStore'
import { ILink } from '../types/Types'
import { NodeLink } from '../types/relations'
// import { getNodeIcon } from '../utils/lib/icons'
import { getUniquePath, isMatch } from '../utils/lib/paths'
import { getLatestContent, useEditorBuffer } from './useEditorBuffer'
import { hierarchyParser } from './useHierarchy'
import { getTitleFromPath, useLinks } from './useLinks'
import { useSearch } from './useSearch'

interface RefactorPath {
  path: string
  namespaceID?: string
}

interface NamespaceChangedPaths {
  removedPaths: ILink[]
  addedPaths: ILink[]
}

interface RefactorResponse {
  changedPaths: Record<string, NamespaceChangedPaths>
}

export const useRefactor = () => {
  // const ilinks = useDataStore((state) => state.ilinks)

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

  // const setILinks = useDataStore((state) => state.setIlinks)
  // const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)
  // const { trackEvent } = useAnalytics()

  // const { q, saveQ } = useSaveQ()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { getNodeidFromPath, updateILinks } = useLinks()
  const { updateDocument } = useSearch()
  const { refactorNotes } = useApi()

  /*
   * Returns a mock array of refactored paths
   * Also refactors children
   * from: the current path
   * to: the new changed path
   */
  const getMockRefactor = (from: string, to: string, clearBuffer = true, notification = true): NodeLink[] => {
    if (clearBuffer) saveAndClearBuffer()
    // saveQ()
    const ilinks = useDataStore.getState().ilinks

    const refactorMap = ilinks
      .filter((i) => {
        const match = isMatch(i.path, from)
        return match
      })
      .map((i) => {
        const s = `${i.path}`
        const newPath = s.replace(from, to)
        return {
          ...i,
          newPath: newPath
        }
      })

    const allPaths = ilinks.map((link) => link.path)

    const refactored = refactorMap.map((f) => {
      // const toPath = f.path.replace(from, to)

      const uniquePath = getUniquePath(f.newPath, allPaths, notification)

      if (uniquePath)
        return {
          from: f.path,
          to: uniquePath?.unique
        }

      return {
        from: f.path,
        to: f.path
      }
    })

    // mog('MOCK REFACTOR', { ilinks, from, to, refactorMap, refactored })
    return refactored
  }

  const execRefactorAsync = async (from: RefactorPath, to: RefactorPath, clearBuffer = true) => {
    mog('FROM < TO', { from, to })
    const nodeId = getNodeidFromPath(from.path, from.namespaceID)
    const uniquePath = useDataStore
      .getState()
      .checkValidILink({ notePath: to.path, namespace: to.namespaceID, showAlert: false })

    const res = await refactorNotes(
      { path: from.path.split('.').join('#'), namespaceID: from.namespaceID },
      { path: uniquePath.split('.').join('#'), namespaceID: to.namespaceID ?? from.namespaceID },
      nodeId
    ).then((response: RefactorResponse) => {
      const addedILinks: ILink[] = []
      const removedILinks: ILink[] = []

      Object.entries(response.changedPaths).forEach(([nsId, nsObject]) => {
        nsObject.addedPaths.forEach((ilink) => {
          ilink.namespace = nsId
        })
        nsObject.removedPaths.forEach((ilink) => {
          ilink.namespace = nsId
        })
        addedILinks.push(...nsObject.addedPaths)
        removedILinks.push(...nsObject.removedPaths)
      })
      mog('AfterRefactor', { addedILinks, removedILinks })
      const refactored = updateILinks(addedILinks, removedILinks)
      const content = getLatestContent(nodeId)

      // * Update search Index with new Title
      // * TODO: Make search API more flexible (Update specific fields)
      if (content && nodeId) {
        const title = getTitleFromPath(uniquePath)
        mog('Updating search index', { title })
        updateDocument('node', nodeId, content, title)
      }
      return refactored
    })

    return res
  }

  // DO NOT DELETE
  // TODO: REVERT REFACTOR IF API CALL FAILS

  // const execRefactor = (from: string, to: string, clearBuffer = true) => {
  //   trackEvent(CustomEvents.REFACTOR, { 'mex-from': from, 'mex-to': to })
  //   const refactored = getMockRefactor(from, to, clearBuffer)

  //   mog('execRefactor', { from, to, refactored })

  //   // Generate the new links
  //   const ilinks = useDataStore.getState().ilinks

  //   const newIlinks = ilinks.map((i) => {
  //     for (const ref of refactored) {
  //       if (ref.from === i.path) {
  //         return {
  //           ...i,
  //           path: ref.to,
  //           icon: getNodeIcon(ref.to)
  //         }
  //       }
  //     }
  //     return i
  //   })

  //   // mog('execRefactor', { from, to, newIlinks })
  //   const isInNewlinks = (l: string) => {
  //     const ft = newIlinks.filter((i) => i.path === l)
  //     return ft.length > 0
  //   }

  //   const newParents = refactored
  //     .map((r) => getAllParentIds(r.to))
  //     .flat()
  //     .filter((x) => !isInNewlinks(x))

  //   const newParentIlinks = newParents.map((p) => ({
  //     path: p,
  //     nodeid: generateNodeUID(),
  //     icon: getNodeIcon(p),
  //     createdAt: Infinity
  //   }))

  //   const newlyGeneratedILinks = [...newIlinks, ...newParentIlinks]

  //   mog('newLy generated id', { newlyGeneratedILinks })

  //   setILinks(newlyGeneratedILinks)

  //   const baseId = linkInRefactor(useDataStore.getState().baseNodeId, refactored)
  //   if (baseId !== false) {
  //     setBaseNodeId(baseId.to)
  //   }

  //   // mog('baseId', { from, to, baseId, refactored })
  //   return refactored
  // }

  return { getMockRefactor, execRefactorAsync }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// DO NOT DELETE
// Used to wrap a class component to provide hooks
// export const withRefactor = (Component: any) => {
//   return function C2(props: any) {
//     const { getMockRefactor, execRefactor } = useRefactor()

//     const prefillRefactorModal = useRefactorStore((state) => state.prefillModal)

//     return (
//       <Component
//         getMockRefactor={getMockRefactor}
//         execRefactor={execRefactor}
//         prefillRefactorModal={prefillRefactorModal}
//         {...props}
//       />
//     ) // eslint-disable-line react/jsx-props-no-spreading
//   }
// }
