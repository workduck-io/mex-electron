import { getParentId } from '@components/mex/Sidebar/treeUtils'
import { useAnalysisStore } from '@store/useAnalysis'
import { mog } from '@utils/lib/helper'
import { checkIfUntitledDraftNode } from '@utils/lib/strings'
import toast from 'react-hot-toast'
import { getPathFromNodeIdHookless } from './useLinks'
import { useRefactor } from './useRefactor'

export const useSaveNodeName = () => {
  const { execRefactor } = useRefactor()

  const saveNodeName = (nodeId: string, title?: string) => {
    if (nodeId !== useAnalysisStore.getState().analysis.nodeid) return
    const draftNodeTitle = title ?? useAnalysisStore.getState().analysis.title
    if (!draftNodeTitle) return

    const nodePath = getPathFromNodeIdHookless(nodeId)
    const isUntitled = checkIfUntitledDraftNode(nodePath)

    if (!isUntitled) return

    const parentNodePath = getParentId(nodePath)
    const newNodePath = `${parentNodePath}.${draftNodeTitle}`

    if (newNodePath !== nodePath)
      try {
        mog('SAVE NODE NAME, 2', { nodeId, title, nodePath, newNodePath, isUntitled, draftNodeTitle })
        execRefactor(nodePath, newNodePath, false)
      } catch (err) {
        toast('Unable to rename node')
      }

    return newNodePath
  }

  return { saveNodeName }
}
