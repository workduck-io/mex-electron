import { idxKey, GenericSearchData, GenericSearchResult } from '../types/search'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

export const useSearch = () => {
  const addDocument = async (key: idxKey, doc: GenericSearchData) => {
    await ipcRenderer.invoke(IpcAction.ADD_DOCUMENT, key, doc)
  }

  const updateDocument = async (key: idxKey, doc: GenericSearchData) => {
    await ipcRenderer.invoke(IpcAction.UPDATE_DOCUMENT, key, doc)
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
