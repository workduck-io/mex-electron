import { Document } from 'flexsearch'
import { NodeSearchData } from '../Types/data'

export const createFlexsearchIndex = (initList: NodeSearchData[]) => {
  const options = {
    document: {
      id: 'nodeUID',
      index: ['title', 'text']
    },
    tokenize: 'full'
  }

  const index = Document(options)
  initList.forEach((i) => index.add(i))

  return index
}

export const flexIndexKeys = [
  'title.cfg',
  'title.ctx',
  'title.map',
  'text.cfg',
  'text.ctx',
  'text.map',
  'reg',
  'store',
  'tag'
]
