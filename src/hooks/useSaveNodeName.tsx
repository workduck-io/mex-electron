import { getParentNodePath } from '@components/mex/Sidebar/treeUtils'
import { useAnalysisStore } from '@store/useAnalysis'
import { mog } from '@utils/lib/mog'
import { checkIfUntitledDraftNode } from '@utils/lib/strings'
import toast from 'react-hot-toast'

import { getLinkFromNodeIdHookless, getPathFromNodeIdHookless } from './useLinks'
import { useRefactor } from './useRefactor'

export const useSaveNodeName = () => {
  const { execRefactorAsync } = useRefactor()

  const saveNodeName = (nodeId: string, title?: string) => {
    if (nodeId !== useAnalysisStore.getState().analysis.nodeid) return
    const draftNodeTitle = title ?? useAnalysisStore.getState().analysis.title
    if (!draftNodeTitle) return

    const node = getLinkFromNodeIdHookless(nodeId)
    const nodePath = node?.path
    const namespace = node?.namespace
    const isUntitled = checkIfUntitledDraftNode(nodePath)

    if (!isUntitled) return

    const parentNodePath = getParentNodePath(nodePath)
    const newNodePath = `${parentNodePath}.${draftNodeTitle}`

    if (newNodePath !== nodePath)
      try {
        mog('SAVE NODE NAME, 2', { nodeId, title, nodePath, newNodePath, isUntitled, draftNodeTitle })
        execRefactorAsync(
          { path: nodePath, namespaceID: namespace },
          { path: newNodePath, namespaceID: namespace },
          false
        )
      } catch (err) {
        toast('Unable to rename node')
      }

    return newNodePath
  }

  return { saveNodeName }
}
