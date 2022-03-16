import { spawn, Worker } from 'threads'

import { mog } from '../../utils/lib/helper'
import { NodeEditorContent } from '../../types/Types'
import { FileData } from '../../types/data'
import { GenericSearchData, GenericSearchResult, idxKey } from '../../types/search'

// @ts-expect-error it don't want .ts
// eslint-disable-next-line
import workerURL from 'threads-plugin/dist/loader?name=worker!./analysis.ts'
// @ts-expect-error it don't want .ts
//eslint-disable-next-line
import searchWorkerURL from 'threads-plugin/dist/loader?name=searchWorker!./search.ts'

export const WORKER_LOCATION = './src/electron/worker'
export let worker = null

export let search_worker = null

export const startAnalysisWorkerService = async () => {
  console.log('startWorkerService')
  if (!worker) worker = await spawn(new Worker(workerURL))
}

export const analyseContent = async (content: NodeEditorContent, callback: (data: any) => void) => {
  try {
    if (!worker) {
      await startAnalysisWorkerService()
      console.log('Creating new analysis worker')
    } else {
      console.log('Reusing analysis worker')
    }
    const analysis = await worker.analyseContent(content)
    callback(analysis)
  } catch (error) {
    console.log(error)
    callback({ outline: [], tags: [] })
  }
}
export const startSearchWorker = async () => {
  console.log('startSearchWorkerService')
  if (!search_worker) search_worker = await spawn(new Worker(searchWorkerURL))
}
export const initSearchIndex = async (fileData: FileData) => {
  try {
    if (!search_worker) {
      console.log('Creating new search worker')
      await startSearchWorker()
      await search_worker.init(fileData)
    } else {
      console.log('Found existing search worker, reusing')
    }
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const addDoc = async (key: idxKey, doc: GenericSearchData) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.addDoc(key, doc)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (key: idxKey, doc: GenericSearchData) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.updateDoc(key, doc)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const removeDoc = async (key: idxKey, id: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.removeDoc(key, id)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const searchIndex = async (
  key: idxKey | idxKey[],
  query: string,
  callback: (results: GenericSearchResult[]) => void
) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndex(key, query)
    callback(results)
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}
