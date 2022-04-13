import { idxKey } from '../types/search'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import { useLinks } from './useLinks'

export const useSearch = () => {
  const { getPathFromNodeid } = useLinks()

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    await ipcRenderer.invoke(IpcAction.ADD_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    await ipcRenderer.invoke(IpcAction.UPDATE_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await ipcRenderer.invoke(IpcAction.REMOVE_DOCUMENT, key, id)
  }

  const queryIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX, key, query, tags)
    return results
  }

  const queryIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX_BY_NODEID, key, nodeId, query)
    return results
  }

  const queryIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX_WITH_RANKING, key, query)
    return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex, queryIndexByNodeId, queryIndexWithRanking }
}
