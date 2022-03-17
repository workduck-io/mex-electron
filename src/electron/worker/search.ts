import { expose } from 'threads/worker'

import { FileData } from './../../types/data'
import {
  createSearchIndex,
  exportIndex,
  createIndexCompositeKey,
  getNodeAndBlockIdFromCompositeKey
} from '../../utils/search/flexsearch'
import { mog } from '../../utils/lib/helper'
import { SearchWorker, idxKey, GenericSearchData, GenericSearchResult, SearchIndex } from '../../types/search'
import { setSearchIndexData } from './../utils/indexData'
import { parseNode } from '../../utils/search/parseData'

let globalSearchIndex: SearchIndex = null
let nodeBlockMapping: { [key: string]: string[] } = null

const searchWorker: SearchWorker = {
  init: (fileData: FileData, indexData: Record<idxKey, any>) => {
    const { idx, nbMap } = createSearchIndex(fileData, indexData)

    globalSearchIndex = idx
    nodeBlockMapping = nbMap
  },

  addDoc: (key: idxKey, nodeId: string, contents: any[], title = '') => {
    if (globalSearchIndex[key]) {
      const parsedBlocks = parseNode(nodeId, contents, title)

      const blockIds = parsedBlocks.map((block) => block.id)
      nodeBlockMapping[nodeId] = blockIds

      parsedBlocks.forEach((block) => {
        block.blockId = createIndexCompositeKey(nodeId, block.blockId)
        globalSearchIndex[key].add(block)
      })
    }
  },

  updateDoc: (key: idxKey, nodeId: string, contents: any[], title = '') => {
    if (globalSearchIndex[key]) {
      const parsedBlocks = parseNode(nodeId, contents, title)

      const existingNodeBlocks = nodeBlockMapping[nodeId] ?? []
      const newBlockIds = parsedBlocks.map((block) => block.blockId)

      const blockIdsToBeDeleted = existingNodeBlocks.filter((id) => !newBlockIds.includes(id))

      mog('UpdatingDoc', { existingNodeBlocks, blockIdsToBeDeleted, parsedBlocks })

      nodeBlockMapping[nodeId] = newBlockIds

      blockIdsToBeDeleted.forEach((blockId) => {
        const compositeKey = createIndexCompositeKey(nodeId, blockId)
        globalSearchIndex[key].remove(compositeKey)
      })

      parsedBlocks.forEach((block) => {
        block.blockId = createIndexCompositeKey(nodeId, block.blockId)
        globalSearchIndex[key].update(block)
      })
    }
  },

  removeDoc: (key: idxKey, id: string) => {
    if (globalSearchIndex[key]) {
      const blockIds = nodeBlockMapping[id]

      delete nodeBlockMapping[id]

      blockIds.forEach((blockId) => {
        const compositeKey = createIndexCompositeKey(id, blockId)
        globalSearchIndex[key].remove(compositeKey)
      })
    }
  },

  searchIndex: (key: idxKey | idxKey[], query: string) => {
    try {
      let response: any[] = []

      if (typeof key === 'string') {
        response = globalSearchIndex[key].search(query, { enrich: true })
      } else {
        key.forEach((k) => {
          response = [...response, ...globalSearchIndex[k].search(query, { enrich: true })]
        })
      }

      mog('response is', { response }, { pretty: true, collapsed: false })
      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          const { nodeId, blockId } = getNodeAndBlockIdFromCompositeKey(i.id)
          results.push({ id: nodeId, blockId, text: i.doc?.text?.slice(0, 100), matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.id == item.id
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(item.matchField)
        } else {
          if (typeof item.matchField == 'string') item.matchField = [item.matchField]
          combinedResults.push(item)
        }
      })

      mog('RESULTS', { combinedResults })

      return combinedResults
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  },

  dumpIndexDisk: async (location: string) => {
    const indexEntries = Object.entries(globalSearchIndex)
    const indexDump = await exportIndex(indexEntries)

    setSearchIndexData(indexDump, location)
  }
}

expose(searchWorker as any)
