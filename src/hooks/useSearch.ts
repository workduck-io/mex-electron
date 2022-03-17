import { idxKey, GenericSearchData, GenericSearchResult } from '../types/search'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import { parseNode } from '../utils/search/parseData'
import { useLinks } from './useLinks'

export const useSearch = () => {
  const { getPathFromNodeid } = useLinks()

  const addDocument = async (key: idxKey, nodeId: string, contents: any[], title?: string) => {
    await ipcRenderer.invoke(IpcAction.ADD_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId))
  }

  const updateDocument = async (key: idxKey, nodeId: string, contents: any[], title?: string) => {
    await ipcRenderer.invoke(IpcAction.UPDATE_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId))
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await ipcRenderer.invoke(IpcAction.REMOVE_DOCUMENT, key, id)
  }

  const queryIndex = async (key: idxKey, query: string) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX, key, query)
    return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex }
}
