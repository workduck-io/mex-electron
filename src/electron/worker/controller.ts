import { spawn, Worker } from 'threads'

import { mog } from '../../utils/lib/helper'
import { NodeEditorContent } from '../../types/Types'
import { FileData } from '../../types/data'
import { GenericSearchData, GenericSearchResult, idxKey, SearchIndex } from '../../types/search'

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

interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
}

export const analyseContent = async (props: AnalyseContentProps, callback: (data: any) => void) => {
  try {
    if (!worker) {
      await startAnalysisWorkerService()
      console.log('Creating new analysis worker')
    } else {
      console.log('Reusing analysis worker')
    }
    const analysis = await worker.analyseContent(props)
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
export const initSearchIndex = async (fileData: FileData, indexData: Record<idxKey, any>) => {
  try {
    if (!search_worker) {
      console.log('Creating new search worker')
      await startSearchWorker()
      await search_worker.init(fileData, indexData)
    } else {
      console.log('Found existing search worker, reusing')
    }
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const addDoc = async (key: idxKey, nodeId: string, contents: any[], title: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.addDoc(key, nodeId, contents, title)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (key: idxKey, nodeId: string, contents: any[], title: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.updateDoc(key, nodeId, contents, title)
  } catch (error) {
    mog('UpdateDocIndexError', { error })
  }
}

export const removeDoc = async (key: idxKey, id: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.removeDoc(key, id)
  } catch (error) {
    mog('RemoveDocIndexError', { error })
  }
}

export const searchIndex = async (key: idxKey, query: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndex(key, query)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const dumpIndexDisk = async (location: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.dumpIndexDisk(location)
  } catch (error) {
    mog('ErrorDumpingIndexToDisk', { error })
  }
}

export const searchIndexByNodeId = async (key: idxKey, nodeId: string, query: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndexByNodeId(key, nodeId, query)
    return results
  } catch (error) {
    mog('SearchIndexByNodeIdError', { error, nodeId })
  }
}
